import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { UpdateAssetHandler } from "@icrc/handlers/assetHandlers/updateAssetHandler/updateAssetHandler";
import { AssetRepository } from "@icrc/repositories";
import { UpdateAssetForm } from "@icrc/types/forms";

interface testDefinition {
    name: string;
    input: UpdateAssetForm;
    data?: {
        updateAsset?: jest.Mock;
    };
    result?: any;
    error?: any;
}

describe("UpdateAssetHandler Process Tests", () => {
    const validForm: UpdateAssetForm = {
        ledgerAddress: mockLedgerAddress,
        assetName: "Test Asset",
        symbol: "TST",
        shortDecimal: 8
    };

    const tests: testDefinition[] = [
        {
            name: "UpdateAssetHandler: Successfully updates asset",
            input: { ...validForm },
            data: {
                updateAsset: jest.fn().mockResolvedValue(undefined),
            },
            result: {},
        },
        {
            name: "UpdateAssetHandler: Fails to update asset",
            input: { ...validForm },
            data: {
                updateAsset: jest.fn().mockRejectedValue(new Error("Update failed")),
            },
            error: new Error("Update failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;

        if (test.data?.updateAsset) {
            assetRepository.updateAsset = test.data.updateAsset;
        }

        const updateAssetHandler = new UpdateAssetHandler(logger, assetRepository);

        const result = await updateAssetHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(assetRepository.updateAsset).toHaveBeenCalledWith(test.input);

    });
});
