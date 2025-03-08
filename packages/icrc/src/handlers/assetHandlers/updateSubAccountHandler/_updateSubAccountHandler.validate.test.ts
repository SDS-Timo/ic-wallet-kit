import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { UpdateSubAccountHandler } from "@icrc/handlers/assetHandlers/updateSubAccountHandler/updateSubAccountHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";
import { UpdateSubAccountForm } from "@icrc/types/forms";

describe("UpdateSubAccountHandler Validation Tests", () => {

    const validForm: UpdateSubAccountForm = {
        ledgerAddress: mockLedgerAddress,
        subAccountNewName: "New SubAccount Name",
        subAccountId: SubAccountId.Default()
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "UpdateSubAccountHandler Validation Tests",
        tests: [
            {
                name: "UpdateSubAccountHandler: Field ledgerAddress is required",
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
                name: "UpdateSubAccountHandler: Field subAccountNewName is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.subAccountNewName),
                    value: "",
                },
                error: new ValidationError(
                    "update.subAccountNewName.assetName.is.required",
                    "subAccountNewName",
                    "Field subAccountNewName is required"
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

            const updateSubAccountHandler = new UpdateSubAccountHandler(logger, assetRepository);

            await updateSubAccountHandler.validate(input);
        }
    );
});
