import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockReceiverPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { GetListTransactionHandler } from "@icrc/handlers/transactionHandlers/getListTransactionHandler/getListTransactionHandler";
import { SendTransactionHandler } from "@icrc/handlers/transactionHandlers/sendTransactionHandler/sendTransactionHandler";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AssetRepository } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { SendTransactionForm } from "@icrc/types/transactions/sendTransactionForm";

jest.mock("@icrc/repositories");

describe("SendTransactionHandler Validation Tests", () => {
    const validForm: SendTransactionForm = {
        ledgerAddress: mockLedgerAddress,
        receiverAccountPrincipal: mockReceiverPrincipal(),
        amount: "100",
        subAccountId: SubAccountId.parseFromString("0x2"),
        receiverSubAccountId: SubAccountId.parseFromString("0x3")
    };

    itValidate(
        validForm,
        {},
        {
            name: "SendTransactionHandler Validation Tests",
            tests: [
                {
                    name: "SendTransactionHandler: Missing ledgerAddress",
                    input: {
                        key: getPropertyName(validForm, (v) => v.ledgerAddress),
                        value: "",
                    },
                    error: new ValidationError(
                        "transfer.ledgerAddress.is.required",
                        "ledgerAddress",
                        "Field ledgerAddress is required"
                    ),
                },
                {
                    name: "SendTransactionHandler: Missing receiverAccountPrincipal",
                    input: {
                        key: getPropertyName(validForm, (v) => v.receiverAccountPrincipal),
                        value: "",
                    },
                    error: new ValidationError(
                        "transfer.receiverAccountPrincipal.is.required",
                        "receiverAccountPrincipal",
                        "Field receiverAccountPrincipal is required"
                    ),
                },
            ],
        },
        async (input) => {
            const logger = new MockLogger();
            const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
            const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
            const getSubAccountByHandler = new (<new () => GetSubAccountByHandler><unknown>GetSubAccountByHandler)() as jest.Mocked<GetSubAccountByHandler>;
            const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;
            const getListTransactionHandler = new (<new () => GetListTransactionHandler><unknown>GetListTransactionHandler)() as jest.Mocked<GetListTransactionHandler>;
            const identifierService = mockAnonymousIdentifierService();

            const handler = new SendTransactionHandler(
                logger,
                identifierService,
                assetMetaDataHandler,
                getSubAccountByHandler,
                subAccountBalanceHandler,
                getListTransactionHandler,
                assetRepository
            );

            await handler.validate(input);
        }
    );
});
