import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListTransactionHandler } from "@icrc/handlers/transactionHandlers/getListTransactionHandler/getListTransactionHandler";
import { SendTransactionHandler } from "@icrc/handlers/transactionHandlers/sendTransactionHandler/sendTransactionHandler";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AssetRepository } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { SendTransactionForm } from "@icrc/types/transactions/sendTransactionForm";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

describe("SendTransactionHandler Process Tests", () => {
    const validForm: SendTransactionForm = {
        ledgerAddress: mockLedgerAddress,
        receiverAccountPrincipal: mockAnonymousIdentifierService().getPrincipal(),
        amount: "100",
        subAccountId: SubAccountId.parseFromString("0x2"),
        receiverSubAccountId: SubAccountId.parseFromString("0x3")
    };

    const tests: testDefinition[] = [
        {
            name: "SendTransactionHandler: Successfully processes a transaction",
            input: { ...validForm },
            data: {
                asset: { ledgerAddress: "mock-ledger-address", fee: BigInt(10), decimals: 8 },
                metaData: { decimals: 8, fee: BigInt(10) },
                subAccount: { data: { balance: BigInt(100000000000000000000000) } },
                transactions: { transactions: [], pageInfo: { hasNext: false } },
            },
            result: { transactions: [] },
        },
        {
            name: "SendTransactionHandler: Successfully processes a transaction",
            input: { ...validForm, amount: "xxx" },
            data: {
                asset: { ledgerAddress: "mock-ledger-address", fee: BigInt(10), decimals: 8 },
                metaData: { decimals: 8, fee: BigInt(10) },
                subAccount: { data: { balance: BigInt(100000000000000000000000) } },
                transactions: { transactions: [], pageInfo: { hasNext: false } },
            },
            error: new ValidationError("transaction.invalid.amount",
                getPropertyName(validForm, f => f.amount),
                "Invalid amount")
        },
        {
            name: "SendTransactionHandler: Successfully processes a transaction",
            input: { ...validForm, amount: "-1" },
            data: {
                asset: { ledgerAddress: "mock-ledger-address", fee: BigInt(10), decimals: 8 },
                metaData: { decimals: 8, fee: BigInt(10) },
                subAccount: { data: { balance: BigInt(100000000000000000000000) } },
                transactions: { transactions: [], pageInfo: { hasNext: false } },
            },
            error: new ValidationError("balance.less.amount",
                getPropertyName(validForm, f => f.amount),
                "Amount should be more that 0")
        },
        {
            name: "SendTransactionHandler: Successfully processes a transaction",
            input: { ...validForm },
            data: {
                asset: { ledgerAddress: "mock-ledger-address", fee: BigInt(10), decimals: 8 },
                metaData: { decimals: 8, fee: BigInt(10) },
                subAccount: {},
                transactions: { transactions: [], pageInfo: { hasNext: false } },
            },
            error: new ValidationError("balance.less.amount",
                getPropertyName(validForm, f => f.amount),
                "Balance should be more that sent amount")
        },
        {
            name: "SendTransactionHandler: Asset not found",
            input: { ...validForm },
            data: {
                asset: undefined,
            },
            error: new ValidationError(
                "asset.not.found",
                "ledgerAddress",
                "Asset Not Found"
            ),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();

        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const getSubAccountByHandler = new (<new () => GetSubAccountByHandler><unknown>GetSubAccountByHandler)() as jest.Mocked<GetSubAccountByHandler>;
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;
        const getListTransactionHandler = new (<new () => GetListTransactionHandler><unknown>GetListTransactionHandler)() as jest.Mocked<GetListTransactionHandler>;

        assetRepository.getAssetOrDefault = jest.fn().mockResolvedValue(test.data?.asset);
        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data?.metaData);
        getSubAccountByHandler.handle = jest.fn().mockResolvedValue(test.data?.subAccount);
        subAccountBalanceHandler.handle = jest.fn().mockResolvedValue(undefined);
        getListTransactionHandler.handle = jest.fn().mockResolvedValue(test.data?.transactions);

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);
        ledgerWrapper.transfer = jest.fn().mockResolvedValue(undefined);

        const handler = new SendTransactionHandler(
            logger,
            identifierService,
            assetMetaDataHandler,
            getSubAccountByHandler,
            subAccountBalanceHandler,
            getListTransactionHandler,
            assetRepository
        );


        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

    });
});
