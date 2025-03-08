import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddSubAccountHandler } from "@icrc/handlers";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";
import { AddSubAccountForm } from "@icrc/types/forms";

describe("AddSubAccountHandler Validation Tests", () => {
    const validForm: AddSubAccountForm = {
        ledgerAddress: mockLedgerAddress,
        subAccountId: SubAccountId.Default(),
        subAccountName: "Test Sub-Account",
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "AddSubAccountHandler Validation Tests",
        tests: [
            {
                name: "AddSubAccountHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "add.subaccount.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "AddSubAccountHandler: Field subAccountName is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.subAccountName),
                    value: "",
                },
                error: new ValidationError(
                    "add.subaccount.subAccountName.is.required",
                    "subAccountName",
                    "Field subAccountName is required"
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
            const getSubAccountByHandler = new (<new () => GetSubAccountByHandler><unknown>GetSubAccountByHandler)() as jest.Mocked<GetSubAccountByHandler>;

            const addSubAccountHandler = new AddSubAccountHandler(logger, assetRepository, getSubAccountByHandler);

            await addSubAccountHandler.validate(input);
        }
    );
});
