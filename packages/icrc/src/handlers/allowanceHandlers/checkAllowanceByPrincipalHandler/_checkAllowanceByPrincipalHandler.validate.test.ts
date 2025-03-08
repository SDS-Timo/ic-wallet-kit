import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { CheckAllowanceByPrincipalHandler } from "@icrc/handlers/allowanceHandlers/checkAllowanceByPrincipalHandler/checkAllowanceByPrincipalHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountId } from "@icrc/types";
import { CheckAllowanceByPrincipalForm } from "@icrc/types/forms";


describe("Unit CheckAllowanceByPrincipalHandler validate tests", () => {

    const valid: CheckAllowanceByPrincipalForm = {
        ledgerAddress: "xxx",
        spenderPrincipal: "xxxx",
        ownerPrincipal: "xxxx",
        spenderSubId: SubAccountId.Default(),
        subAccountId: SubAccountId.Default(),
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "CheckAllowanceByPrincipalHandler validation success",
        tests: [
            {
                name: "CheckAllowanceByPrincipalHandler: ledgerAddress is required",
                input: {
                    key: getPropertyName(valid, v => v.ledgerAddress),
                    value: ""
                },
                error: new ValidationError("adding.allowance.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required")

            },
            {
                name: "CheckAllowanceByPrincipalHandler: Field spenderPrincipal is required",
                input: {
                    key: getPropertyName(valid, v => v.spenderPrincipal),
                    value: ""
                },
                error: new ValidationError("check.allowance.spender.is.required",
                    "spenderPrincipal",
                    "Field spenderPrincipal is required")

            },
            {
                name: "CheckAllowanceByPrincipalHandler: Field ownerPrincipal is required",
                input: {
                    key: getPropertyName(valid, v => v.ownerPrincipal),
                    value: ""
                },
                error: new ValidationError("check.allowance.ownerPrincipal.is.required",
                    "ownerPrincipal",
                    "Field ownerPrincipal is required")

            },
            {
                name: "CheckAllowanceByPrincipalHandler: Field subAccountId is required",
                input: {
                    key: getPropertyName(valid, v => v.subAccountId),
                    value: ""
                },
                error: new ValidationError("check.allowance.subAccountId.is.required",
                    "subAccountId",
                    "Field subAccountId is required")

            },
            {
                name: "CheckAllowanceByPrincipalHandler: Field spenderSubId is required",
                input: {
                    key: getPropertyName(valid, v => v.spenderSubId),
                    value: ""
                },
                error: new ValidationError("check.allowance.spenderSubId.is.required",
                    "spenderSubId",
                    "Field spenderSubId is required")

            }

        ]
    };

    itValidate(valid, {}, tests, async (input, data) => {

        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();

        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;

        const checkAllowanceByPrincipalHandler = new CheckAllowanceByPrincipalHandler(logger,
            identifierService,
            assetMetaDataHandler
        );

        await checkAllowanceByPrincipalHandler.validate(input);

    });

});
