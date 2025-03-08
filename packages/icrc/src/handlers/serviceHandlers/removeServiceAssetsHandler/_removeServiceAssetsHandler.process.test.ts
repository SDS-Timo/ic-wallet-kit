import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveServiceAssetsHandler } from "@icrc/handlers";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { RemoveServiceAssetForm } from "@icrc/types/forms";

describe("RemoveServiceAssetsHandler Process Tests", () => {
    const validForm: RemoveServiceAssetForm = {
        servicePrincipal: "mock-service-principal",
        ledgerAddress: mockLedgerAddress
    };

    const tests: testDefinition[] = [
        {
            name: "RemoveServiceAssetsHandler: Successfully removes service asset",
            input: { ...validForm },
            result: {},
        },
        {
            name: "RemoveServiceAssetsHandler: Fails to remove service asset",
            input: { ...validForm },
            data: {
                removeServiceAsset: jest.fn().mockRejectedValue(new Error("Remove failed")),
            },
            error: new Error("Remove failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;

        serviceRepository.removeServiceAsset = jest.fn().mockResolvedValue(undefined);

        if (test.data?.removeServiceAsset) {
            serviceRepository.removeServiceAsset = test.data.removeServiceAsset;
        }

        const handler = new RemoveServiceAssetsHandler(logger, serviceRepository);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(serviceRepository.removeServiceAsset).toHaveBeenCalledWith(
            test.input.servicePrincipal,
            test.input.ledgerAddress
        );
    });
});
