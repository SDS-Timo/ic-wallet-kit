import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { CheckServicePrincipalHandler } from "@icrc/handlers/serviceHandlers/checkServicePrincipalHandler/checkServicePrincipalHandler";
import { CheckServicePrincipalForm } from "@icrc/types/forms/services/checkServicePrincipalForm";
import { Icrc84ActorWrapper } from "@icrc/wrappers";

describe("CheckServicePrincipalHandler Process Tests", () => {
    const validForm: CheckServicePrincipalForm = {
        servicePrincipal: "mock-service-principal",
    };

    const tests: testDefinition[] = [
        {
            name: "CheckServicePrincipalHandler: Service principal exists",
            input: { ...validForm },
            result: { isPrincipalExist: true },
        },
        {
            name: "CheckServicePrincipalHandler: Service principal does not exist",
            input: { ...validForm },
            data: {
                wrapperError: new Error("Service interface not recognized"),
            },
            result: { isPrincipalExist: false },
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();

        const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
        Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);

        if (test.data?.wrapperError) {
            icrc84ActorWrapper.getSupportedAssets = jest.fn().mockRejectedValue(test.data.wrapperError);
        } else {
            icrc84ActorWrapper.getSupportedAssets = jest.fn().mockResolvedValue(undefined);
        }

        const handler = new CheckServicePrincipalHandler(logger, identifierService);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);
    });
});
