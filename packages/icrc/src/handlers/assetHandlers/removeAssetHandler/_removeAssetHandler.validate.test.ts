import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveAssetHandler } from "@icrc/handlers/assetHandlers/removeAssetHandler/removeAssetHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { RemoveAssetForm } from "@icrc/types/forms";

describe("RemoveAssetHandler Validation Tests", () => {
    const validForm: RemoveAssetForm = {
        ledgerAddress: "test-ledger-address",
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "RemoveAssetHandler Validation Tests",
        tests: [
            {
                name: "RemoveAssetHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "remove.asset.ledgerAddress.is.required",
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
        async (input, validData) => {
            const logger = new MockLogger();
            const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
            const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;
            const localCacheRepository = new (<new () => AssetLocalCache><unknown>AssetLocalCache)() as jest.Mocked<AssetLocalCache>;

            const removeAssetHandler = new RemoveAssetHandler(logger, assetRepository, contactRepository, localCacheRepository);

            await removeAssetHandler.validate(input);
        }
    );
});
