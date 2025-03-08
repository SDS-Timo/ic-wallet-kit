import { MockLogger } from "@icrc/__tests_utils/mockLogger";

import { mockLedgerAddress, mockReceiverPrincipal, mockSpenderPrincipal } from "@icrc/__tests_utils/mockConstrains";

import { ValidationError } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { TransferFromAllowanceHandler } from "@icrc/handlers/allowanceHandlers/transferFromAllowanceHandler/transferFromAllowanceHandler";
import { GetAllowanceSubAccountBalanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getAllowanceSubAccountBalanceCacheHandler/getAllowanceSubAccountBalanceCacheHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AssetRepository } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { TransferFromAllowanceForm } from "@icrc/types/forms";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit TransferFromAllowanceHandler validate tests", () => {

    const validForm: TransferFromAllowanceForm = {
        ledgerAddress: mockLedgerAddress,
        receiverPrincipal: mockReceiverPrincipal(),
        toSubAccountId: SubAccountId.Default(),
        senderPrincipal: mockSpenderPrincipal(),
        fromSubAccountId: SubAccountId.Default(),
        amount: "100",
    };

    const tests: testDefinition[] = [
        {
            name: "TransferFromAllowanceHandler: Asset not supported standard ICRC-2",
            input: validForm,
            data: {
                assetMetaData: undefined,
                supportedStandard: false
            },
            error: new ValidationError("asset.not.supported.standard", "", "Asset not supported standard ICRC-2")
        },
        {
            name: "TransferFromAllowanceHandler: Asset Not Found",
            input: validForm,
            data: {
                assetMetaData: undefined,
                supportedStandard: true
            },
            error: new ValidationError("asset.not.found", "ledgerAddress", "Asset Not Found")
        },
        {
            name: "TransferFromAllowanceHandler: Invalid amount",
            input: { ...validForm, amount: "z" },
            data: {
                assetMetaData: {
                    decimals: 8
                },
                supportedStandard: true
            },
            error: new ValidationError("transfer.allowance.invalid.amount", "amount", "Invalid amount")
        },
        {
            name: "TransferFromAllowanceHandler: The sent amount should be lees that the balance",
            input: { ...validForm, amount: "1000" },
            data: {
                assetMetaData: {
                    decimals: 8,
                    fee: 1000n
                },
                supportedStandard: true,
                allowanceSubAccountBalance: {
                    balance: 10n
                }
            },
            error: new ValidationError("balance.less.amount", "transferAmount", "The sent amount should be lees that the balance")
        },
        {
            name: "TransferFromAllowanceHandler: success",
            input: { ...validForm, amount: "0.001" },
            data: {
                assetMetaData: {
                    decimals: 8,
                    fee: 1000n
                },
                supportedStandard: true,
                allowanceSubAccountBalance: {
                    balance: 1000000000000n
                }
            },
            result: {}
        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const getAllowanceSubAccountBalanceHandler = new (<new () => GetAllowanceSubAccountBalanceCacheHandler><unknown>GetAllowanceSubAccountBalanceCacheHandler)() as jest.Mocked<GetAllowanceSubAccountBalanceCacheHandler>;


        assetRepository.checkSupportedStandard = jest.fn().mockResolvedValue(test.data?.supportedStandard);
        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data?.assetMetaData);

        getAllowanceSubAccountBalanceHandler.handle = jest.fn().mockResolvedValue(test.data?.allowanceSubAccountBalance);

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);
        ledgerWrapper.transferFrom = jest.fn().mockReturnValue({});

        const transferFromAllowanceHandler = new TransferFromAllowanceHandler(
            logger,
            identifierService,
            assetMetaDataHandler,
            assetRepository,
            getAllowanceSubAccountBalanceHandler
        );

        const result = await transferFromAllowanceHandler.process(test.input);

        console.log(result);

        expect(result).toEqual(test.result);

    });
});