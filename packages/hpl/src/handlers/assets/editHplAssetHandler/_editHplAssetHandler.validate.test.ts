import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { EditHplAssetHandler } from "@hpl/handlers/assets/editHplAssetHandler/editHplAssetHandler";
import { HplAssetRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";

describe("Unit EditHplAssetHandler validate tests", () => {

    const valid = {
        assetId: 1n,
        name: "Test",
        symbol: "Test"
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "EditHplAssetHandler validation success",
        tests: [
            {
                name: "EditHplAssetHandler: Field assetId is required",
                input: {
                    key: getPropertyName(valid, v => v.assetId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("editing.hpl.account.assetId.is.required",
                    "assetId",
                    "Field assetId is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const hplAssetRepository = new (<new () => HplAssetRepository><unknown>HplAssetRepository)() as jest.Mocked<HplAssetRepository>;

        const editHplAssetHandler = new EditHplAssetHandler(logger,
            hplAssetRepository
        );
        await editHplAssetHandler.validate(input);

    });

});
