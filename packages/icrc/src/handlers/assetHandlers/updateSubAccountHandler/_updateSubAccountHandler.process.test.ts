import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { UpdateSubAccountHandler } from "@icrc/handlers";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";
import { UpdateSubAccountForm } from "@icrc/types/forms";

describe("UpdateSubAccountHandler Process Tests", () => {

    const validForm: UpdateSubAccountForm = {
        ledgerAddress: mockLedgerAddress,
        subAccountNewName: "Updated SubAccount Name",
        subAccountId: SubAccountId.Default()
    };

    const tests: testDefinition[] = [
        {
            name: "UpdateSubAccountHandler: Successfully updates sub-account",
            input: { ...validForm },
            data: {
                updateSubAccount: jest.fn().mockResolvedValue(undefined),
            },
            result: {},
        },
        {
            name: "UpdateSubAccountHandler: Fails to update sub-account",
            input: { ...validForm },
            data: {
                updateSubAccount: jest.fn().mockRejectedValue(new Error("Update failed")),
            },
            error: new Error("Update failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;

        if (test.data?.updateSubAccount) {
            assetRepository.updateSubAccount = test.data.updateSubAccount;
        }

        const updateSubAccountHandler = new UpdateSubAccountHandler(logger, assetRepository);

        const result = await updateSubAccountHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(assetRepository.updateSubAccount).toHaveBeenCalledWith(test.input);

    });
});
