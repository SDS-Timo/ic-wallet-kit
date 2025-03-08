import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditContactHandler } from "@icrc/handlers/contactHandlers/editContactHandler/editContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { EditContactForm } from "@icrc/types/contacts/editContactForm";

describe("EditContactHandler Validation Tests", () => {

    const validForm: EditContactForm = {
        name: "Test Contact",
        principal: mockSpenderPrincipalString(),
    };

    const validData = {
        isContactExist: true,
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "EditContactHandler Validation Tests",
        tests: [
            {
                name: "EditContactHandler: Field name is required",
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
                name: "EditContactHandler: Field principal is required",
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
            {
                name: "EditContactHandler: Contact does not exist",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: mockSpenderPrincipalString(),
                },
                data: {
                    key: getPropertyName(validData, (v) => v.isContactExist),
                    value: false,
                },
                error: new ValidationError(
                    "add.contact.not.exists",
                    "",
                    "Contact not exists"
                ),
            },
        ],
    };

    itValidate(
        validForm,
        validData,
        tests,
        async (input, data) => {
            const logger = new MockLogger();
            const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

            contactRepository.isContactExist = jest.fn().mockResolvedValue(data.isContactExist);

            const editContactHandler = new EditContactHandler(logger, contactRepository);

            await editContactHandler.validate(input);
        }
    );
});
