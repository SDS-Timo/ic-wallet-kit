import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveContactHandler } from "@icrc/handlers/contactHandlers/removeContactHandler/removeContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { RemoveContactForm } from "@icrc/types/contacts/removeContactForm";

describe("RemoveContactHandler Validation Tests", () => {

    const validForm: RemoveContactForm = {
        principal: mockPrincipal,
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "RemoveContactHandler Validation Tests",
        tests: [
            {
                name: "RemoveContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: "",
                },
                error: new ValidationError(
                    "removing.contact.principal.is.required",
                    "principal",
                    "Field principal is required"
                ),
            },
            {
                name: "RemoveContactHandler: Contact does not exist",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: mockPrincipal,
                },
                data: {
                    key: "isContactExist",
                    value: false,
                },
                error: new ValidationError(
                    "removing.contact.not.exists",
                    "",
                    "Contact not exists"
                ),
            },
        ],
    };

    itValidate(
        validForm,
        { isContactExist: true },
        tests,
        async (input, data) => {
            const logger = new MockLogger();
            const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

            contactRepository.isContactExist = jest.fn().mockResolvedValue(data.isContactExist);

            const handler = new RemoveContactHandler(logger, contactRepository);

            await handler.validate(input);
        }
    );
});
