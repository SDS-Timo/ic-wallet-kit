import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { CheckServicePrincipalHandler } from "@icrc/handlers/serviceHandlers/checkServicePrincipalHandler/checkServicePrincipalHandler";
import { CheckServicePrincipalForm } from "@icrc/types/forms/services/checkServicePrincipalForm";

describe("CheckServicePrincipalHandler Validation Tests", () => {
    const validForm: CheckServicePrincipalForm = {
        servicePrincipal: "mock-service-principal",
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "CheckServicePrincipalHandler Validation Tests",
        tests: [
            {
                name: "CheckServicePrincipalHandler: Field servicePrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.servicePrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "check.service.servicePrincipal.is.required",
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
            const identifierService = mockAnonymousIdentifierService();

            const handler = new CheckServicePrincipalHandler(logger, identifierService);

            await handler.validate(input);
        }
    );
});
