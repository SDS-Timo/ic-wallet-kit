
import { FormResult } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { RemoveServiceHandler } from "@icrc/handlers/serviceHandlers/removeServiceHandler/removeServiceHandler";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";

describe("Unit AddServiceHandler tests", () => {
    const testData = [
        {
            name: "add service",
            input: {
                newName: "Test",
                servicePrincipal: "service-test-test-test-test"
            },
            data: {
                isSuccess: true
            },
            result: FormResult.success({})
        },
        {
            name: "add service return error",
            input: {
                newName: "Test",
                servicePrincipal: "service-test-test-test-test"
            },
            data: {
                isSuccess: false
            },
            result: FormResult.error([{
                fieldName: "",
                localizationKey: "unexpected.error.message",
                message: "\"Test Error\""
            }])
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();
            const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;
            serviceRepository.removeService = test.data.isSuccess
                ? jest.fn().mockReturnValue(Promise.resolve(undefined))
                : jest.fn().mockReturnValue(Promise.reject("Test Error"));
            const logger = new MockLogger();
            const removeServiceHandler = new RemoveServiceHandler(logger, serviceRepository);
            const result = await removeServiceHandler.handle(test.input);
            expect(result).toEqual(test.result);

        }, 10000);
    }

})
