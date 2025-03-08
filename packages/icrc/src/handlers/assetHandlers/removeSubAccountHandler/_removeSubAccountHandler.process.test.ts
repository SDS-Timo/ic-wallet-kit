import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveSubAccountHandler } from "@icrc/handlers/assetHandlers/removeSubAccountHandler/removeSubAccountHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";
import { RemoveSubAccountForm } from "@icrc/types/forms";

describe("RemoveSubAccountHandler Process Tests", () => {
    const validForm: RemoveSubAccountForm = {
        ledgerAddress: mockLedgerAddress,
        subAccountId: SubAccountId.Default(),
    };

    const tests: testDefinition[] = [
        {
            name: "RemoveSubAccountHandler: Successfully removes sub-account",
            input: { ...validForm },
            data: {
                removeSubAccount: jest.fn().mockResolvedValue(undefined),
            },
            result: {},
        },
        {
            name: "RemoveSubAccountHandler: Fails to remove sub-account from local cache",
            input: { ...validForm },
            data: {
                removeSubAccount: jest.fn().mockRejectedValue(new Error("Local cache error")),
            },
            error: new Error("Local cache error"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const localCacheRepository = new (<new () => AssetLocalCache><unknown>AssetLocalCache)() as jest.Mocked<AssetLocalCache>;

        localCacheRepository.removeSubAccount = jest.fn().mockReturnValue(undefined);

        if (test.data) {
            assetRepository.removeSubAccount = test.data.removeSubAccount;
        }

        const removeSubAccountHandler = new RemoveSubAccountHandler(logger, assetRepository, localCacheRepository);

        const result = await removeSubAccountHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(assetRepository.removeSubAccount).toHaveBeenCalledWith(test.input);

        expect(localCacheRepository.removeSubAccount).toHaveBeenCalledWith(
            test.input.ledgerAddress,
            test.input.subAccountId
        );

    });
});
