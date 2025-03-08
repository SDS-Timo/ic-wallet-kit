import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddContactHandler } from "@icrc/handlers/contactHandlers";
import { AssetRepository } from "@icrc/repositories";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { SubAccountId } from "@icrc/types";
import { AddContactForm } from "@icrc/types/contacts/addContactForm";
import { AssetContactForm } from "@icrc/types/contacts/assetContactForm";
import { SubAccountContactForm } from "@icrc/types/contacts/subAccountContactForm";

describe("AddContactHandler Validation Tests", () => {

    const validSubAccount: SubAccountContactForm = {
        name: "SubAccount Name",
        subAccountId: SubAccountId.Default(),
    };

    const validAsset: AssetContactForm = {
        ledgerAddress: mockLedgerAddress,
        subAccounts: [validSubAccount],
    };

    const validForm: AddContactForm = {
        name: "Test Contact",
        principal: mockSpenderPrincipalString(),
        assets: [validAsset],
    };

    const validData = {
        assetList: [{ ledgerAddress: mockLedgerAddress }],
        isContactExist: false,
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "AddContactHandler Validation Tests",
        tests: [
            {
                name: "AddContactHandler: Field name is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.name),
                    value: ""
                },
                error: new ValidationError("add.contact.name.is.required", "name", "Field name is required"),
            },
            {
                name: "AddContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: ""
                },
                error: new ValidationError("add.contact.principal.is.required", "principal", "Field principal is required"),
            },
            {
                name: "AddContactHandler: Contact already exists",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: mockSpenderPrincipalString()
                },
                data: { key: getPropertyName(validData, (v) => v.isContactExist), value: true },
                error: new ValidationError("add.contact.already.exists", "", "Contact already exists"),
            },
            {
                name: "AddContactHandler: SubAccount name is empty",
                input: {
                    key: getPropertyName(validForm, (v) => v.assets),
                    value: [{
                        ...validAsset, subAccounts: [{ ...validSubAccount, name: "" }]
                    }],
                },
                error: new ValidationError("add.contact.subAccount.name.empty", "", "SubAccount name is empty"),
            },
            {
                name: "AddContactHandler: Asset not found",
                input: {
                    key: getPropertyName(validForm, (v) => v.assets),
                    value: [{
                        ...validAsset, ledgerAddress: "invalid-ledger-address"
                    }]
                },
                error: new ValidationError(
                    "add.contact.ledgerAddress.not.found",
                    "",
                    "Asset not found, Ledger address: invalid-ledger-address"
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
            const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;

            contactRepository.isContactExist = jest.fn().mockResolvedValue(data.isContactExist);
            assetRepository.getTokensOrDefault = jest.fn().mockResolvedValue(data.assetList);

            const addContactHandler = new AddContactHandler(logger, contactRepository, assetRepository);

            await addContactHandler.validate(input);
        }
    );
});
