import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditOrAddContactHandler } from "@icrc/handlers/contactHandlers/editOrAddContactHandler/editOrAddContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { EditContactForm } from "@icrc/types/contacts/editContactForm";

describe("EditOrAddContactHandler Validation Tests", () => {

    const validForm: EditContactForm = {
        name: "Test Contact",
        principal: mockSpenderPrincipalString(),
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "EditOrAddContactHandler Validation Tests",
        tests: [
            {
                name: "EditOrAddContactHandler: Field name is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.name),
                    value: "",
                },
                error: new ValidationError(
                    "add.contact.name.is.required",
                    "name",
                    "Field name is required"
                ),
            },
            {
                name: "EditOrAddContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: "",
                },
                error: new ValidationError(
                    "add.contact.principal.is.required",
                    "principal",
                    "Field principal is required"
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

            const handler = new EditOrAddContactHandler(logger, contactRepository);

            await handler.validate(input);
        }
    );
});
