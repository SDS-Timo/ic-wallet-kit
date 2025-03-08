import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveAssetContactHandler } from "@icrc/handlers/contactHandlers/removeAssetContactHandler/removeAssetContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { RemoveAssetContactForm } from "@icrc/types/contacts/removeAssetContactForm";

describe("RemoveAssetContactHandler Validation Tests", () => {

    const validForm: RemoveAssetContactForm = {
        principal: mockPrincipal,
        ledgerAddress: mockLedgerAddress,
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "RemoveAssetContactHandler Validation Tests",
        tests: [
            {
                name: "RemoveAssetContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: "",
                },
                error: new ValidationError(
                    "remove.asset.contact.principal.is.required",
                    "principal",
                    "Field principal is required"
                ),
            },
            {
                name: "RemoveAssetContactHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "remove.asset.contact.ledgerAddress.is.required",
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

            const handler = new RemoveAssetContactHandler(logger, contactRepository);

            await handler.validate(input);
        }
    );
});
