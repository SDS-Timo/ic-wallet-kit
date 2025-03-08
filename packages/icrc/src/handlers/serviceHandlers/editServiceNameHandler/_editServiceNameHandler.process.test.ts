import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { EditServiceNameHandler } from "@icrc/handlers/serviceHandlers/editServiceNameHandler/editServiceNameHandler";
import { ServiceRepository } from "@icrc/repositories";
import { EditServiceNameForm } from "@icrc/types/forms";

interface testDefinition {
    name: string;
    input: EditServiceNameForm;
    data?: {
        updateServiceName?: jest.Mock;
    };
    result?: any;
    error?: any;
}

describe("EditServiceNameHandler Process Tests", () => {
    const validForm: EditServiceNameForm = {
        servicePrincipal: "mock-service-principal",
        newName: "Updated Service Name",
    };

    const tests: testDefinition[] = [
        {
            name: "EditServiceNameHandler: Successfully updates the service name",
            input: { ...validForm },
            result: {},
        },
        {
            name: "EditServiceNameHandler: Fails to update service name",
            input: { ...validForm },
            data: {
                updateServiceName: jest.fn().mockRejectedValue(new Error("Update failed")),
            },
            error: new Error("Update failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;

        serviceRepository.updateServiceName = jest.fn().mockResolvedValue(undefined);

        if (test.data?.updateServiceName) {
            serviceRepository.updateServiceName = test.data.updateServiceName;
        }

        const handler = new EditServiceNameHandler(logger, serviceRepository);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(serviceRepository.updateServiceName).toHaveBeenCalledWith(
            test.input.servicePrincipal,
            test.input.newName
        );

    });
});
