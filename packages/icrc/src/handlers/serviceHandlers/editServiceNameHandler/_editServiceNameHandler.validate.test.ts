import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditServiceNameHandler } from "@icrc/handlers/serviceHandlers/editServiceNameHandler/editServiceNameHandler";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { EditServiceNameForm } from "@icrc/types/forms";

describe("EditServiceNameHandler Validation Tests", () => {
    const validForm: EditServiceNameForm = {
        servicePrincipal: "mock-service-principal",
        newName: "New Service Name",
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "EditServiceNameHandler Validation Tests",
        tests: [
            {
                name: "EditServiceNameHandler: Field servicePrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.servicePrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "edit.service.servicePrincipal.is.required",
                    "servicePrincipal",
                    "Field servicePrincipal is required"
                ),
            },
            {
                name: "EditServiceNameHandler: Field newName is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.newName),
                    value: "",
                },
                error: new ValidationError(
                    "edit.service.newName.is.required",
                    "newName",
                    "Field name is required"
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

            const handler = new EditServiceNameHandler(logger, serviceRepository);

            await handler.validate(input);
        }
    );
});
