import { ValidationError } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListTransactionHandler } from "@icrc/handlers/transactionHandlers/getListTransactionHandler/getListTransactionHandler";
import { AssetRepository } from "@icrc/repositories";
import { TransactionRepository } from "@icrc/repositories/persists/transactionRepository/transactionRepository";
import { SubAccountId } from "@icrc/types";
import { TransactionManagerConfiguration } from "@icrc/types/configuration/transactionManagerConfiguration";
import { GetListTransactionForm } from "@icrc/types/transactions/getListTransactionForm";


describe("GetListTransactionHandler Process Tests", () => {
    const validForm: GetListTransactionForm = {
        ledgerAddress: "mock-ledger-address",
        pageInfo: {
            nextPageKey: "mock-page-key",
            take: 10
        },
    };

    const tests: testDefinition[] = [
        {
            name: "GetListTransactionHandler: Successfully retrieves ICP transactions",
            input: { ...validForm, subAccountId: SubAccountId.Default() },
            data: {
                asset: {
                    tokenSymbol: "ICP",
                    ledgerAddress: "mock-ledger-address",
                    indexAddress: "mock-index-address",
                    subAccounts: [{ subAccountId: "0x0" }],
                },
                transactions: {
                    transactions: [{ transaction: "t1" }, { transaction: "t1" }],
                    pageInfo: { nextPageKey: "next-page", hasNext: true },
                },
            },
            result: {
                transactions: [{ transaction: "t1" }, { transaction: "t1" }],
                pageInfo: { nextPageKey: "next-page", hasNext: true },
            },
        },
        {
            name: "GetListTransactionHandler: Successfully retrieves OGYL transactions",
            input: { ...validForm },
            data: {
                asset: {
                    tokenSymbol: "OGYL",
                    ledgerAddress: "mock-ledger-address",
                    indexAddress: "mock-index-address",
                    subAccounts: [{ subAccountId: "0x0" }],
                },
                transactions: {
                    transactions: [{ transaction: "t2" }, { transaction: "t2" }],
                    pageInfo: { nextPageKey: "next-page", hasNext: true },
                },
            },
            result: {
                transactions: [{ transaction: "t2" }, { transaction: "t2" }],
                pageInfo: { nextPageKey: "next-page", hasNext: true },
            },
        },
        {
            name: "GetListTransactionHandler: Successfully retrieves BTC transactions",
            input: { ...validForm },
            data: {
                asset: {
                    tokenSymbol: "BTC",
                    ledgerAddress: "mock-ledger-address",
                    indexAddress: "mock-index-address",
                    subAccounts: [{ subAccountId: "0x0" }],
                },
                transactions: {
                    transactions: [{ transaction: "t3" }, { transaction: "t3" }],
                    pageInfo: { nextPageKey: "next-page", hasNext: true },
                },
            },
            result: {
                transactions: [{ transaction: "t3" }, { transaction: "t3" }],
                pageInfo: { nextPageKey: "next-page", hasNext: true },
            },
        },
        {
            name: "GetListTransactionHandler: Asset not found",
            input: { ...validForm },
            data: {
                asset: undefined,
            },
            error: new ValidationError(
                "get.list.transaction.asset.not.found",
                "ledgerAddress",
                "Asset Not Found"
            ),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const transactionRepository = new (<new () => TransactionRepository><unknown>TransactionRepository)() as jest.Mocked<TransactionRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;

        assetRepository.getAssetOrDefault = jest.fn().mockResolvedValue(test.data?.asset);
        transactionRepository.getIcpListTransaction = jest.fn().mockResolvedValue(test.data?.transactions);
        transactionRepository.getIcrcListTransactionByAsset = jest.fn().mockResolvedValue(test.data?.transactions);

        const configuration: TransactionManagerConfiguration = {
            icpUrl: "mock-icp-url",
            icpBlockchain: "mock-icp-blockchain",
            icpNetwork: "mock-icp-network",
            ogyUrl: "mock-ogy-url",
            ogyBlockchain: "mock-ogy-blockchain",
            ogyNetwork: "mock-ogy-network",
        };

        const handler = new GetListTransactionHandler(logger, configuration, transactionRepository, assetRepository);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(assetRepository.getAssetOrDefault).toHaveBeenCalledWith(test.input.ledgerAddress);

        if (test.data?.asset?.tokenSymbol === "ICP" || test.data?.asset?.tokenSymbol === "OGYL") {
            expect(transactionRepository.getIcpListTransaction).toHaveBeenCalled();
        } else {
            expect(transactionRepository.getIcrcListTransactionByAsset).toHaveBeenCalled();
        }

    });
});
