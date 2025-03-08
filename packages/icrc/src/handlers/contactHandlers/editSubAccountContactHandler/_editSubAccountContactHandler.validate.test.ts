import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditSubAccountContactHandler } from "@icrc/handlers";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { SubAccountId } from "@icrc/types";
import { EditSubAccountContactForm } from "@icrc/types/contacts/editSubAccountContactForm";

describe("EditSubAccountContactHandler Validation Tests", () => {

    const validForm: EditSubAccountContactForm = {
        principal: mockSpenderPrincipalString(),
        ledgerAddress: mockLedgerAddress,
        oldSubAccountId: SubAccountId.parseFromString("0x1"),
        newSubAccountId: SubAccountId.parseFromString("0x2"),
        newSubAccountName: "Updated SubAccount Name",
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "EditSubAccountContactHandler Validation Tests",
        tests: [
            {
                name: "EditSubAccountContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: "",
                },
                error: new ValidationError(
                    "edit.contact.principal.is.required",
                    "principal",
                    "Field principal is required"
                ),
            },
            {
                name: "EditSubAccountContactHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "edit.contact.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "EditSubAccountContactHandler: Field newSubAccountName is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.newSubAccountName),
                    value: "",
                },
                error: new ValidationError(
                    "edit.contact.newSubAccountName.is.required",
                    "newSubAccountName",
                    "Field newSubAccountName is required"
                ),
            },
        ],
    };

    itValidate(
        validForm,
        {},
        tests,
        async (input) => {
            const logger = new MockLogger();
            const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

            const handler = new EditSubAccountContactHandler(logger, contactRepository);

            await handler.validate(input);
        }
    );
});
