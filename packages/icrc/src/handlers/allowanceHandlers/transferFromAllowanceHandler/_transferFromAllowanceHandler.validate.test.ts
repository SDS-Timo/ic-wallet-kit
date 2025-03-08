import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockReceiverPrincipal, mockSpenderPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { TransferFromAllowanceHandler } from "@icrc/handlers/allowanceHandlers/transferFromAllowanceHandler/transferFromAllowanceHandler";
import { GetAllowanceSubAccountBalanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getAllowanceSubAccountBalanceCacheHandler/getAllowanceSubAccountBalanceCacheHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AssetRepository } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { TransferFromAllowanceForm } from "@icrc/types/forms";

describe("Unit TransferFromAllowanceHandler validation tests", () => {
    const validForm: TransferFromAllowanceForm = {
        ledgerAddress: mockLedgerAddress,
        receiverPrincipal: mockReceiverPrincipal(),
        toSubAccountId: SubAccountId.Default(),
        senderPrincipal: mockSpenderPrincipal(),
        fromSubAccountId: SubAccountId.Default(),
        amount: "100",
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "TransferFromAllowanceHandler validation success",
        tests: [
            {
                name: "Validation Error: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.allowance.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "Validation Error: Field receiverPrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.receiverPrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.allowance.receiverPrincipal.is.required",
                    "receiverPrincipal",
                    "Field receiverPrincipal is required"
                ),
            },
            {
                name: "Validation Error: Field toSubAccountId is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.toSubAccountId),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.allowance.toSubAccountId.is.required",
                    "toSubAccountId",
                    "Field toSubAccountId is required"
                ),
            },
            {
                name: "Validation Error: Field senderPrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.senderPrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.allowance.senderPrincipal.is.required",
                    "senderPrincipal",
                    "Field senderPrincipal is required"
                ),
            },
            {
                name: "Validation Error: Field fromSubAccountId is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.fromSubAccountId),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.allowance.fromSubAccountId.is.required",
                    "fromSubAccountId",
                    "Field fromSubAccountId is required"
                ),
            },
            {
                name: "Validation Error: Field amount is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.amount),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.allowance.amount.is.required",
                    "amount",
                    "Field transferAmount is required"
                ),
            },
        ]
    };

    itValidate(validForm, {}, tests, async (input) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const getAllowanceSubAccountBalanceHandler = new (<new () => GetAllowanceSubAccountBalanceCacheHandler><unknown>GetAllowanceSubAccountBalanceCacheHandler)() as jest.Mocked<GetAllowanceSubAccountBalanceCacheHandler>;

        const transferFromAllowanceHandler = new TransferFromAllowanceHandler(
            logger,
            identifierService,
            assetMetaDataHandler,
            assetRepository,
            getAllowanceSubAccountBalanceHandler
        );

        await transferFromAllowanceHandler.validate(input);
    });
});
