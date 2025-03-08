import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveServiceHandler } from "@icrc/handlers";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { RemoveServiceForm } from "@icrc/types/forms";

describe("RemoveServiceHandler Process Tests", () => {
    const validForm: RemoveServiceForm = {
        servicePrincipal: "mock-service-principal",
    };

    const tests: testDefinition[] = [
        {
            name: "RemoveServiceHandler: Successfully removes a service",
            input: { ...validForm },
            result: {},
        },
        {
            name: "RemoveServiceHandler: Fails to remove a service",
            input: { ...validForm },
            data: {
                removeService: jest.fn().mockRejectedValue(new Error("Remove failed")),
            },
            error: new Error("Remove failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;

        serviceRepository.removeService = jest.fn().mockResolvedValue(undefined);

        if (test.data?.removeService) {
            serviceRepository.removeService = test.data.removeService;
        }

        const handler = new RemoveServiceHandler(logger, serviceRepository);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(serviceRepository.removeService).toHaveBeenCalledWith(
            test.input.servicePrincipal
        );

    });
});
