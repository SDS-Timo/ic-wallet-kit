import { IdentifierService, ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { CheckAssetHandler } from "@icrc/handlers";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { CheckAssetForm } from "@icrc/types/forms";

describe("CheckAssetHandler Validation Tests", () => {
    const validForm: CheckAssetForm = {
        ledgerAddress: "test-ledger-address",
        indexAddress: "test-index-address",
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "CheckAssetHandler Validation Tests",
        tests: [
            {
                name: "CheckAssetHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "check.asset.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "CheckAssetHandler: Field indexAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.indexAddress),
                    value: "",
                },
                error: new ValidationError(
                    "check.asset.indexAddress.is.required",
                    "indexAddress",
                    "Field indexAddress is required"
                ),
            },
        ],
    };

    itValidate(
        validForm,
        {},
        tests,
        async (input, validData) => {
            const logger = new MockLogger();
            const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;

            const checkAssetHandler = new CheckAssetHandler(logger, identifierService, assetRepository);

            await checkAssetHandler.validate(input);
        }
    );
});
