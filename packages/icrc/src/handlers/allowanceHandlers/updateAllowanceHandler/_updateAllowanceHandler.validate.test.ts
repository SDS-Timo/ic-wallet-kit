import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { UpdateAllowanceForm } from "@icrc/types/forms";

import { mockAssetManagerConfiguration, mockLedgerAddress, mockOwnerPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { UpdateAllowanceHandler } from "@icrc/handlers/allowanceHandlers/updateAllowanceHandler/updateAllowanceHandler";

import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";

describe("Unit UpdateAllowanceHandler validation tests", () => {
    const validForm: UpdateAllowanceForm = {
        ledgerAddress: mockLedgerAddress,
        spenderPrincipal: mockOwnerPrincipalString(),
        subAccountId: SubAccountId.Default(),
        spenderSubId: SubAccountId.Default(),
        amount: "10",
        expiration: undefined,
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "UpdateAllowanceHandler validation success",
        tests: [
            {
                name: "UpdateAllowanceHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "update.allowance.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "UpdateAllowanceHandler: Field spender is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.spenderPrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "update.allowance.spender.is.required",
                    "spender",
                    "Field spender is required"
                ),
            },
            {
                name: "UpdateAllowanceHandler: Field subAccountId is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.subAccountId),
                    value: "",
                },
                error: new ValidationError(
                    "update.allowance.subAccountId.is.required",
                    "subAccountId",
                    "Field subAccountId is required"
                ),
            },
            {
                name: "UpdateAllowanceHandler: Field amount is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.amount),
                    value: "",
                },
                error: new ValidationError(
                    "update.allowance.amount.is.required",
                    "amount",
                    "Field amount is required"
                ),
            },
        ]
    };

    itValidate(validForm, {}, tests, async (input) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const allowanceLocalCache = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;

        const updateAllowanceHandler = new UpdateAllowanceHandler(
            logger,
            identifierService,
            assetMetaDataHandler,
            allowanceLocalCache,
            subAccountBalanceHandler,
            mockAssetManagerConfiguration
        );

        await updateAllowanceHandler.validate(input);
    });
});
