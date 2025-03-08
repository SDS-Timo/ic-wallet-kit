import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddAssetHandler } from "@icrc/handlers/assetHandlers/addAssetHandler/addAssetHandler";
import { AddAssetForm } from "@icrc/types/forms/assets/addAssetForm";

import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { LoadAssetHandler } from "@icrc/internalHandlers/loadAssetHandler/loadAssetHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";

describe("AddAssetHandler Validation Tests", () => {
    const validForm: AddAssetForm = {
        ledgerAddress: mockLedgerAddress,
        indexAddress: "test-index-address",
        name: "Test Asset",
        symbol: "TST",
        shortDecimal: 8,
    };

    const validData =
    {
        isAssetExist: false
    }

    const tests: testValidate<testValidateDefinition> = {
        name: "AddAssetHandler Validation Tests",
        tests: [
            {
                name: "AddAssetHandler: Asset already imported",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "existing-ledger-address",
                },
                data: {
                    key: getPropertyName(validData, (v) => v.isAssetExist),
                    value: true
                },
                error: new ValidationError(
                    "adding.asset.already.imported",
                    "",
                    "Asset already Imported"
                ),
            },
        ],
    };

    itValidate(
        validForm,
        validData,
        tests,
        async (input, validData) => {
            const logger = new MockLogger();
            const identifierService = mockAnonymousIdentifierService();
            const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
            const loadAssetHandler = new (<new () => LoadAssetHandler><unknown>LoadAssetHandler)() as jest.Mocked<LoadAssetHandler>;
            const getTokenSNSCacheHandler = new (<new () => GetTokenSNSCacheHandler><unknown>GetTokenSNSCacheHandler)() as jest.Mocked<GetTokenSNSCacheHandler>;

            assetRepository.isAssetExist = jest.fn().mockResolvedValue(validData.isAssetExist);

            const addAssetHandler = new AddAssetHandler(
                logger,
                assetRepository,
                loadAssetHandler,
                identifierService,
                getTokenSNSCacheHandler
            );

            await addAssetHandler.validate(input);
        }
    );
});
