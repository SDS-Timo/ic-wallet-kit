import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddSubAccountContactHandler } from "@icrc/handlers/contactHandlers/addSubAccountContactHandler/addSubAccountContactHandler";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { SubAccountId } from "@icrc/types";
import { AssetManagerConfiguration } from "@icrc/types/configuration/assetManagerConfiguration";
import { AddSubAccountContactForm } from "@icrc/types/contacts/addSubAccountContactForm";

describe("AddSubAccountContactHandler Validation Tests", () => {


    const validForm: AddSubAccountContactForm = {
        principal: mockSpenderPrincipalString(),
        ledgerAddress: mockLedgerAddress,
        subAccountName: "Test SubAccount",
        subAccountId: SubAccountId.parseFromString("0x1"),
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "AddSubAccountContactHandler Validation Tests",
        tests: [
            {
                name: "AddSubAccountContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: "",
                },
                error: new ValidationError(
                    "add.subAccount.contact.principal.is.required",
                    "principal",
                    "Field principal is required"
                ),
            },
            {
                name: "AddSubAccountContactHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "add.subAccount.contact.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "AddSubAccountContactHandler: Field subAccountName is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.subAccountName),
                    value: "",
                },
                error: new ValidationError(
                    "add.subAccount.contact.subAccountName.is.required",
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
        async (input) => {
            const logger = new MockLogger();
            const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;
            const getIcrcAllowanceForContactHandler = new (<new () => GetIcrcAllowanceForContactCacheHandler><unknown>GetIcrcAllowanceForContactCacheHandler)() as jest.Mocked<GetIcrcAllowanceForContactCacheHandler>;
            const configuration = {} as AssetManagerConfiguration;

            const handler = new AddSubAccountContactHandler(
                logger,
                configuration,
                contactRepository,
                getIcrcAllowanceForContactHandler
            );

            await handler.validate(input);
        }
    );
});
