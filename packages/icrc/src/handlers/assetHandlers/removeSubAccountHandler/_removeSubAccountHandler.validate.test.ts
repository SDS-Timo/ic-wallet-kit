import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveSubAccountHandler } from "@icrc/handlers/assetHandlers/removeSubAccountHandler/removeSubAccountHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";
import { RemoveSubAccountForm } from "@icrc/types/forms";

describe("RemoveSubAccountHandler Validation Tests", () => {
    const validForm: RemoveSubAccountForm = {
        ledgerAddress: mockLedgerAddress,
        subAccountId: SubAccountId.Default(),
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "RemoveSubAccountHandler Validation Tests",
        tests: [
            {
                name: "RemoveSubAccountHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "remove.subAccount.ledgerAddress.is.required",
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
            const localCacheRepository = new (<new () => AssetLocalCache><unknown>AssetLocalCache)() as jest.Mocked<AssetLocalCache>;

            const removeSubAccountHandler = new RemoveSubAccountHandler(logger, assetRepository, localCacheRepository);

            await removeSubAccountHandler.validate(input);
        }
    );
});
