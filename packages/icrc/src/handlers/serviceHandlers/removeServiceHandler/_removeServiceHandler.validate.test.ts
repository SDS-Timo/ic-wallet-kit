import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveServiceHandler } from "@icrc/handlers";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { RemoveServiceForm } from "@icrc/types/forms";

describe("RemoveServiceHandler Validation Tests", () => {
    const validForm: RemoveServiceForm = {
        servicePrincipal: "mock-service-principal",
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "RemoveServiceHandler Validation Tests",
        tests: [
            {
                name: "RemoveServiceHandler: Field servicePrincipal is required",
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
        ],
    };

    itValidate(
        validForm,
        {},
        tests,
        async (input) => {
            const logger = new MockLogger();
            const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;

            const handler = new RemoveServiceHandler(logger, serviceRepository);

            await handler.validate(input);
        }
    );
});
