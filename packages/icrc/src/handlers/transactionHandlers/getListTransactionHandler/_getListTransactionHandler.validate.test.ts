import { PageResultEmptyKey, ValidationError } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListTransactionHandler } from "@icrc/handlers/transactionHandlers/getListTransactionHandler/getListTransactionHandler";
import { AssetRepository } from "@icrc/repositories";
import { TransactionRepository } from "@icrc/repositories/persists/transactionRepository/transactionRepository";
import { TransactionManagerConfiguration } from "@icrc/types/configuration/transactionManagerConfiguration";
import { GetListTransactionForm } from "@icrc/types/transactions/getListTransactionForm";

jest.mock("@icrc/repositories");

describe("GetListTransactionHandler Validation Tests", () => {
    const validForm: GetListTransactionForm = {
        ledgerAddress: "mock-ledger-address",
        pageInfo: {
            nextPageKey: "mock-page-key",
            take: 10
        },
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "GetListTransactionHandler Validation Tests",
        tests: [
            {
                name: "GetListTransactionHandler: Next page key is the last index",
                input: {
                    key: "pageInfo",
                    value: {
                        nextPageKey: PageResultEmptyKey,
                        take: 10
                    },
                },
                error: new ValidationError(
                    "get.list.transaction.nextPageKey.lastIndex",
                    "nextPageKey",
                    "It was last page. Please check PageResult.hasNext on previous request. Please make sure that hasNext is true."
                ),
            },
            {
                name: "GetListTransactionHandler: Field ledgerAddress is required",
                input: {
                    key: "ledgerAddress",
                    value: "",
                },
                error: new ValidationError(
                    "get.list.transaction.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
        ],
    };

    itValidate(
        validForm,
        {},
        tests,
        async (input) => {
            const logger = new MockLogger();
            const transactionRepository = new (<new () => TransactionRepository><unknown>TransactionRepository)() as jest.Mocked<TransactionRepository>;
            const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
            const configuration: TransactionManagerConfiguration = {
                icpUrl: "",
                icpBlockchain: "",
                icpNetwork: "",
                ogyUrl: "",
                ogyBlockchain: "",
                ogyNetwork: "",
            };

            const handler = new GetListTransactionHandler(logger, configuration, transactionRepository, assetRepository);

            await handler.validate(input);
        }
    );
});
