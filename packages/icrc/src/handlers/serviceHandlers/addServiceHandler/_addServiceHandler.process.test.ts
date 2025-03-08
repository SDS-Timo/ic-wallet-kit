import { FormResult } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddServiceHandler } from "@icrc/handlers/serviceHandlers/addServiceHandler/addServiceHandler";
import { SupportedAssetsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/supportedAssetsCacheHandler/supportedAssetsCacheHandler";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import * as mapper from "@icrc/maps/serviceMapper";
import { AssetRepository } from "@icrc/repositories";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { AddServiceForm } from "@icrc/types/forms";

describe("AddServiceHandler Process Tests", () => {

    const validForm: AddServiceForm = {
        newName: "Test Service",
        servicePrincipal: "mock-service-principal",
    };

    const tests: testDefinition[] = [
        {
            name: "AddServiceHandler: Successfully adds a service and returns assets",
            input: { ...validForm },
            data: {
                tokens: [{ ledgerAddress: "mock-token", symbol: "TOKEN" }],
                availableAssets: [{ ledgerAddress: "mock-token", name: "Mock Token" }],
            },
            result: {
                serviceAssets: [],
                availableAssets: [{ ledgerAddress: "mock-token", name: "Mock Token" }],
                serviceName: "Test Service",
                servicePrincipal: "mock-service-principal",
                isSync: true,
            },
        },
        {
            name: "AddServiceHandler: Returns empty available assets when none are found",
            input: { ...validForm },
            data: {
                tokens: [],
                availableAssets: [],
            },
            result: {
                serviceAssets: [],
                availableAssets: [],
                serviceName: "Test Service",
                servicePrincipal: "mock-service-principal",
                isSync: true,
            },
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const identifierService = mockAnonymousIdentifierService();
        const getTokenSNSCacheHandler = new (<new () => GetTokenSNSCacheHandler><unknown>GetTokenSNSCacheHandler)() as jest.Mocked<GetTokenSNSCacheHandler>;
        const supportedAssetsHandler = new (<new () => SupportedAssetsCacheHandler><unknown>SupportedAssetsCacheHandler)() as jest.Mocked<SupportedAssetsCacheHandler>;

        serviceRepository.addService = jest.fn().mockResolvedValue(undefined);
        assetRepository.getTokensOrDefault = jest.fn().mockResolvedValue(test.data?.tokens ?? []);

        getTokenSNSCacheHandler.handle = jest.fn().mockResolvedValue(FormResult.error([]));

        supportedAssetsHandler.handle = jest.fn().mockResolvedValue(FormResult.error([]));

        const addServiceHandler = new AddServiceHandler(logger, identifierService, serviceRepository, assetRepository, getTokenSNSCacheHandler, supportedAssetsHandler);

        const mock = jest.spyOn(mapper, "buildAvailableAssetView");
        mock.mockReturnValue(test.data?.availableAssets ?? []);

        const result = await addServiceHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(serviceRepository.addService).toHaveBeenCalledWith({
            principal: test.input.servicePrincipal,
            name: test.input.newName,
            assets: [],
        });
        expect(assetRepository.getTokensOrDefault).toHaveBeenCalled();
    });
});
