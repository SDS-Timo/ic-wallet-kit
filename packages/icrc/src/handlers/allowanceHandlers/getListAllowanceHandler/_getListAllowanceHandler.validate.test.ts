import { getPropertyName, LoadType, ValidationError } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockAssetManagerConfiguration, mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListAllowanceHandler } from "@icrc/handlers/allowanceHandlers/getListAllowanceHandler/getListAllowanceHandler";
import { GetIcrcAllowanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceCacheHandler/getIcrcAllowanceCacheHandler";
import { GetListAllowanceForm } from "@icrc/types/forms/allowances/getListAllowanceForm";

import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AllowanceRepository, AssetRepository } from "@icrc/repositories";

describe("Unit GetListAllowanceHandler validation tests", () => {
    const validForm: GetListAllowanceForm = {
        ledgerAddress: mockLedgerAddress,
        loadType: LoadType.Cache
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "GetListAllowanceHandler validation success",
        tests: [
            {
                name: "Validation Error: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "get.allowance.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            }
        ]
    };

    itValidate(validForm, {}, tests, async (input) => {
        const logger = new MockLogger();
        const allowanceRepository = new (<new () => AllowanceRepository><unknown>AllowanceRepository)() as jest.Mocked<AllowanceRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const getIcrcAllowanceHandler = new (<new () => GetIcrcAllowanceCacheHandler><unknown>GetIcrcAllowanceCacheHandler)() as jest.Mocked<GetIcrcAllowanceCacheHandler>;
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;

        const getListAllowanceHandler = new GetListAllowanceHandler(
            logger,
            mockAssetManagerConfiguration,
            allowanceRepository,
            assetRepository,
            getIcrcAllowanceHandler,
            assetMetaDataHandler
        );

        await getListAllowanceHandler.validate(input);
    });
});
