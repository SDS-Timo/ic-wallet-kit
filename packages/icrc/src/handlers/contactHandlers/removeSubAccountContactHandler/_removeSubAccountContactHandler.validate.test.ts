import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveSubAccountContactHandler } from "@icrc/handlers/contactHandlers/removeSubAccountContactHandler/removeSubAccountContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { SubAccountId } from "@icrc/types";
import { RemoveSubAccountContactForm } from "@icrc/types/contacts/removeSubAccountContactForm";

describe("RemoveSubAccountContactHandler Validation Tests", () => {

    const validForm: RemoveSubAccountContactForm = {
        principal: mockPrincipal,
        ledgerAddress: mockLedgerAddress,
        subAccountId: SubAccountId.parseFromString("0x1"),
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "RemoveSubAccountContactHandler Validation Tests",
        tests: [
            {
                name: "RemoveSubAccountContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: "",
                },
                error: new ValidationError(
                    "remove.subaccount.contact.principal.is.required",
                    "principal",
                    "Field principal is required"
                ),
            },
            {
                name: "RemoveSubAccountContactHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "remove.subaccount.contact.ledgerAddress.is.required",
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
        async (input) => {
            const logger = new MockLogger();
            const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

            const handler = new RemoveSubAccountContactHandler(logger, contactRepository);

            await handler.validate(input);
        }
    );
});
