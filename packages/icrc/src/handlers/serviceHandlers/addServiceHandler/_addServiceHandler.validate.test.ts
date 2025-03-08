import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddServiceHandler } from "@icrc/handlers";
import { SupportedAssetsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/supportedAssetsCacheHandler/supportedAssetsCacheHandler";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { AssetRepository } from "@icrc/repositories";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { AddServiceForm } from "@icrc/types/forms";
import { Icrc84ActorWrapper } from "@icrc/wrappers";

describe("AddServiceHandler Validation Tests", () => {
    const mockServicePrincipal = "mock-service-principal";

    const validForm: AddServiceForm = {
        newName: "Test Service",
        servicePrincipal: mockServicePrincipal,
    };

    const validData =
    {
        isServiceExist: false,
        isUnRecognized: false,
    }

    const tests: testValidate<testValidateDefinition> = {
        name: "AddServiceHandler Validation Tests",
        tests: [
            {
                name: "AddServiceHandler: Field name is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.newName),
                    value: "",
                },
                error: new ValidationError(
                    "add.service.name.is.required",
                    "newName",
                    "Field name is required"
                ),
            },
            {
                name: "AddServiceHandler: Service already exists",
                input: {
                    key: getPropertyName(validForm, (v) => v.servicePrincipal),
                    value: mockServicePrincipal,
                },
                data: {
                    key: getPropertyName(validData, (v) => v.isServiceExist),
                    value: true,
                },
                error: new ValidationError(
                    "add.service.already.exist",
                    "servicePrincipal",
                    "Service already exist"
                ),
            },
            {
                name: "AddServiceHandler: Invalid service interface",
                input: {
                    key: getPropertyName(validForm, (v) => v.servicePrincipal),
                    value: mockServicePrincipal,
                },
                data: {
                    key: getPropertyName(validData, (v) => v.isUnRecognized),
                    value: true
                },
                error: new ValidationError(
                    "add.service.invalid",
                    "servicePrincipal",
                    "Service interface not recognized"
                ),
            },
        ],
    };

    itValidate(
        validForm,
        validData,
        tests,
        async (input, data) => {
            const logger = new MockLogger();
            const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;
            const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
            const identifierService = mockAnonymousIdentifierService();
            const getTokenSNSCacheHandler = new (<new () => GetTokenSNSCacheHandler><unknown>GetTokenSNSCacheHandler)() as jest.Mocked<GetTokenSNSCacheHandler>;
            const supportedAssetsHandler = new (<new () => SupportedAssetsCacheHandler><unknown>SupportedAssetsCacheHandler)() as jest.Mocked<SupportedAssetsCacheHandler>;

            serviceRepository.isServiceExist = jest.fn().mockResolvedValue(data.isServiceExist);
            const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
            Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);

            if (data.isUnRecognized) {
                icrc84ActorWrapper.getSupportedAssets = jest.fn().mockRejectedValue(new Error("Service interface not recognized"));

            } else {
                icrc84ActorWrapper.getSupportedAssets = jest.fn().mockResolvedValue(undefined);

            }

            const handler = new AddServiceHandler(logger, identifierService, serviceRepository, assetRepository, getTokenSNSCacheHandler, supportedAssetsHandler);

            await handler.validate(input);
        }
    );
});
