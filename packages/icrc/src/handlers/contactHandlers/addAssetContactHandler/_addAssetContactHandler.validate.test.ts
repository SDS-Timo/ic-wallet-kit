import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddAssetContactHandler } from "@icrc/handlers";
import { AssetRepository } from "@icrc/repositories";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AddAssetContactForm } from "@icrc/types/contacts/addAssetContactForm";

describe("AddAssetContactHandler Validation Tests", () => {

    const validForm: AddAssetContactForm = {
        principal: mockSpenderPrincipalString(),
        ledgerAddress: mockLedgerAddress,
    };

    const validData = {
        asset: { ledgerAddress: mockLedgerAddress }
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "AddAssetContactHandler Validation Tests",
        tests: [
            {
                name: "AddAssetContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.principal),
                    value: "",
                },
                error: new ValidationError(
                    "add.asset.contact.principal.is.required",
                    "principal",
                    "Field principal is required"
                ),
            },
            {
                name: "AddAssetContactHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "add.asset.contact.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "AddAssetContactHandler: Asset Not Found",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "xxx",
                },
                data: {
                    key: getPropertyName(validData, (v) => v.asset),
                    value: undefined,
                },
                error: new ValidationError("add.asset.contact.ledgerAddress.not.found",
                    "ledgerAddress",
                    "Asset Not Found")
            },
        ],
    };

    itValidate(
        validForm,
        validData,
        tests,
        async (input, data) => {
            const logger = new MockLogger();
            const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
            const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

            assetRepository.getAssetOrDefault = jest.fn().mockResolvedValue(data.asset);

            const addAssetContactHandler = new AddAssetContactHandler(logger, contactRepository, assetRepository);

            await addAssetContactHandler.validate(input);
        }
    );
});
