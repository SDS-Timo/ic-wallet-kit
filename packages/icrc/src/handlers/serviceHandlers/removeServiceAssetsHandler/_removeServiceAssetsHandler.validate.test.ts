import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveServiceAssetsHandler } from "@icrc/handlers";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { RemoveServiceAssetForm } from "@icrc/types/forms";

describe("RemoveServiceAssetsHandler Validation Tests", () => {
    const validForm: RemoveServiceAssetForm = {
        servicePrincipal: "mock-service-principal",
        ledgerAddress: mockLedgerAddress
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "RemoveServiceAssetsHandler Validation Tests",
        tests: [
            {
                name: "RemoveServiceAssetsHandler: Field servicePrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.servicePrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "remove.service.servicePrincipal.is.required",
                    "servicePrincipal",
                    "Field servicePrincipal is required"
                ),
            },
            {
                name: "RemoveServiceAssetsHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "remove.service.ledgerAddress.is.required",
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
            const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;

            const handler = new RemoveServiceAssetsHandler(logger, serviceRepository);

            await handler.validate(input);
        }
    );
});
