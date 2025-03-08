import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { UpdateAssetHandler } from "@icrc/handlers/assetHandlers/updateAssetHandler/updateAssetHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { UpdateAssetForm } from "@icrc/types/forms";

describe("UpdateAssetHandler Validation Tests", () => {
    const validForm: UpdateAssetForm = {
        ledgerAddress: "mockLedgerAddress",
        assetName: "mockAssetName",
        symbol: "mockSymbol",
        shortDecimal: 8
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "UpdateAssetHandler Validation Tests",
        tests: [
            {
                name: "UpdateAssetHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "update.asset.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "UpdateAssetHandler: Field assetName is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.assetName),
                    value: "",
                },
                error: new ValidationError(
                    "update.asset.assetName.is.required",
                    "assetName",
                    "Field assetName is required"
                ),
            },
            {
                name: "UpdateAssetHandler: Field symbol is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.symbol),
                    value: "",
                },
                error: new ValidationError(
                    "update.asset.symbol.is.required",
                    "symbol",
                    "Field symbol is required"
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

            const updateAssetHandler = new UpdateAssetHandler(logger, assetRepository);

            await updateAssetHandler.validate(input);
        }
    );
});
