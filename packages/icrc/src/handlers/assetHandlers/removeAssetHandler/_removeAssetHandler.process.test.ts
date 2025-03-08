import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveAssetHandler } from "@icrc/handlers/assetHandlers/removeAssetHandler/removeAssetHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { RemoveAssetForm } from "@icrc/types/forms";

describe("RemoveAssetHandler Process Tests", () => {
    const validForm: RemoveAssetForm = {
        ledgerAddress: mockLedgerAddress,
    };

    const tests: testDefinition[] = [
        {
            name: "RemoveAssetHandler: Successfully removes asset",
            input: { ...validForm },
            data: {
                removeLocalCache: jest.fn().mockResolvedValue(undefined),
            },
            result: {},
        },
        {
            name: "RemoveAssetHandler: Fails to remove asset from local cache",
            input: { ...validForm },
            data: {
                removeLocalCache: jest.fn().mockRejectedValue(new Error("Local cache error")),
            },
            error: new Error("Local cache error"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;
        const localCacheRepository = new (<new () => AssetLocalCache><unknown>AssetLocalCache)() as jest.Mocked<AssetLocalCache>;

        contactRepository.removeAssetFromAllContacts = jest.fn().mockResolvedValue(undefined);
        assetRepository.remove = jest.fn().mockResolvedValue(undefined);

        if (test.data) {
            localCacheRepository.removeAsset = test.data.removeLocalCache || jest.fn();
        }

        const removeAssetHandler = new RemoveAssetHandler(logger, assetRepository, contactRepository, localCacheRepository);

        const result = await removeAssetHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.removeAssetFromAllContacts).toHaveBeenCalledWith(test.input.ledgerAddress);
        expect(assetRepository.remove).toHaveBeenCalledWith(test.input.ledgerAddress);
        expect(localCacheRepository.removeAsset).toHaveBeenCalledWith(test.input.ledgerAddress);

    });
});
