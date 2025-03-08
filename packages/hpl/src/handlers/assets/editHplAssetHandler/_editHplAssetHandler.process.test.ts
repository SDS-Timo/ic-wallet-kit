import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { EditHplAssetForm } from "@hpl/forms";
import { EditHplAssetHandler } from "@hpl/handlers/assets/editHplAssetHandler/editHplAssetHandler";
import { HplAssetRepository } from "@hpl/repositories";
import { ValidationError } from "@ic-wallet-kit/common";

describe("Unit EditHplAssetHandler process tests", () => {

    const form: EditHplAssetForm = {
        assetId: 1n,
        name: "Test",
        symbol: "Test"
    };

    const tests = [
        {
            name: "EditHplAssetHandler: success",
            input: form,
            result:
            {
            }
        },
        {
            name: "EditHplAssetHandler: asset not exists",
            input: form,
            data: {
                updateAsset: jest.fn().mockRejectedValue(new ValidationError("asset.not.exists",
                    "assetId",
                    "FtAsset not exists. AssetId: 1")),
            },
            result: {},
            error: new Error("FtAsset not exists. AssetId: 1")

        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();

        const hplAssetRepository = new (<new () => HplAssetRepository><unknown>HplAssetRepository)() as jest.Mocked<HplAssetRepository>;
        hplAssetRepository.updateAsset = jest.fn().mockResolvedValue(Promise.resolve(undefined));

        if (test.data?.updateAsset) {
            hplAssetRepository.updateAsset = test.data.updateAsset
        }

        const editHplAssetHandler = new EditHplAssetHandler(logger,
            hplAssetRepository
        );

        const result = await editHplAssetHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(hplAssetRepository.updateAsset).toHaveBeenCalledWith(
            expect.objectContaining({
                assetId: test.input.assetId,
                symbol: test.input.symbol,
                name: test.input.name
            })
        );
    });

});
