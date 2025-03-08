import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditOrAddSubAccountContactHandler } from "@icrc/handlers";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AddSubAccountContactForm, SubAccountId } from "@icrc/types";

describe("EditOrAddSubAccountContactHandler Validation Tests", () => {

    const validForm: AddSubAccountContactForm = {
        principal: mockSpenderPrincipalString(),
        ledgerAddress: mockLedgerAddress,
        subAccountName: "Test SubAccount",
        subAccountId: SubAccountId.parseFromString("0x1")
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "EditOrAddSubAccountContactHandler Validation Tests",
        tests: [
            {
                name: "EditOrAddSubAccountContactHandler: Field principal is required",
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
                name: "EditOrAddSubAccountContactHandler: Field ledgerAddress is required",
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
                name: "EditOrAddSubAccountContactHandler: Field subAccountName is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.subAccountName),
                    value: "",
                },
                error: new ValidationError(
                    "edit.contact.subAccountName.is.required",
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
            const getAllowanceHandler = new (<new () => GetIcrcAllowanceForContactCacheHandler><unknown>GetIcrcAllowanceForContactCacheHandler)() as jest.Mocked<GetIcrcAllowanceForContactCacheHandler>;

            const handler = new EditOrAddSubAccountContactHandler(logger, contactRepository, getAllowanceHandler);

            await handler.validate(input);
        }
    );
});
