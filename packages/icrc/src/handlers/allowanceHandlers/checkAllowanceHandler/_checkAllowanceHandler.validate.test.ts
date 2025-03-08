import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockAssetManagerConfiguration } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { CheckAllowanceHandler } from "@icrc/handlers/allowanceHandlers/checkAllowanceHandler/checkAllowanceHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AllowanceLocalCache, AllowanceRepository, AssetRepository } from "@icrc/repositories";
import { CheckAllowanceForm } from "@icrc/types/forms";

import { SubAccountId } from "@icrc/types";

describe("Unit CheckAllowanceHandler validate tests", () => {

    const valid: CheckAllowanceForm = {
        ledgerAddress: "xxx",
        spenderPrincipal: "xxxx",
        subAccountId: SubAccountId.Default(),
        spenderSubId: SubAccountId.Default(),
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "CheckAllowanceHandler validation success",
        tests: [
            {
                name: "CheckAllowanceHandler: ledgerAddress is required",
                input: {
                    key: getPropertyName(valid, v => v.ledgerAddress),
                    value: ""
                },
                error: new ValidationError("adding.allowance.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required")
            },
            {
                name: "CheckAllowanceHandler: Field spenderPrincipal is required",
                input: {
                    key: getPropertyName(valid, v => v.spenderPrincipal),
                    value: ""
                },
                error: new ValidationError("adding.allowance.spender.is.required",
                    "spenderPrincipal",
                    "Field spender is required")
            },
            {
                name: "CheckAllowanceHandler: Field subAccountId is required",
                input: {
                    key: getPropertyName(valid, v => v.subAccountId),
                    value: ""
                },
                error: new ValidationError("adding.allowance.subAccountId.is.required",
                    "subAccountId",
                    "Field subAccountId is required")
            }
        ]
    };

    itValidate(valid, {}, tests, async (input, data) => {

        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();

        const allowanceRepository = new (<new () => AllowanceRepository><unknown>AllowanceRepository)() as jest.Mocked<AllowanceRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const allowanceLocalCache = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;

        const checkAllowanceHandler = new CheckAllowanceHandler(logger,
            mockAssetManagerConfiguration,
            assetMetaDataHandler,
            assetRepository,
            allowanceRepository,
            identifierService,
            allowanceLocalCache
        );

        await checkAllowanceHandler.validate(input);

    });

});
