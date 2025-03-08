import { ValidationError } from "@ic-wallet-middleware/common";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { IServiceDataStorage } from "@icrc/storage";
import { ServiceModel } from "@icrc/types";
import { AddServiceAssetForm } from "@icrc/types/forms";


jest.mock("@icrc/storage");

describe("ServiceRepository", () => {
    let serviceDataStorage: jest.Mocked<IServiceDataStorage>;
    let serviceRepository: ServiceRepository;

    beforeEach(() => {
        serviceDataStorage = {
            getItems: jest.fn(),
            addItem: jest.fn(),
            updateItem: jest.fn(),
            deleteItem: jest.fn(),
            getItem: jest.fn()
        } as unknown as jest.Mocked<IServiceDataStorage>;

        serviceRepository = new ServiceRepository(serviceDataStorage);
    });

    it("ServiceRepository:getServices should return all services", async () => {
        const mockServices: ServiceModel[] = [{ principal: "service-1", name: "Test Service", assets: [] }];
        serviceDataStorage.getItems.mockResolvedValue(mockServices);

        const result = await serviceRepository.getServices();

        expect(result).toEqual(mockServices);
        expect(serviceDataStorage.getItems).toHaveBeenCalled();
    });

    it("ServiceRepository:addService should add a new service", async () => {
        const newService: ServiceModel = { principal: "service-2", name: "New Service", assets: [] };

        await serviceRepository.addService(newService);

        expect(serviceDataStorage.addItem).toHaveBeenCalledWith(newService);
    });

    it("ServiceRepository:updateServiceName should update service name", async () => {
        const existingService: ServiceModel = { principal: "service-3", name: "Old Name", assets: [] };
        serviceDataStorage.getItem.mockResolvedValue(existingService);

        const updatedService = await serviceRepository.updateServiceName("service-3", "New Name");

        expect(updatedService.name).toBe("New Name");
        expect(serviceDataStorage.updateItem).toHaveBeenCalledWith({ principal: "service-3", name: "New Name", assets: [] });
    });

    it("ServiceRepository:removeService should delete a service", async () => {
        await serviceRepository.removeService("service-4");

        expect(serviceDataStorage.deleteItem).toHaveBeenCalledWith("service-4");
    });

    it("ServiceRepository:addServiceAssets should add assets to a service", async () => {
        const existingService: ServiceModel = { principal: "service-5", name: "Service", assets: [] };
        serviceDataStorage.getItem.mockResolvedValue(existingService);

        const newAssets: AddServiceAssetForm[] = [{
            ledgerAddress: "ledger-1",
            decimal: 8,
            logo: "",
            shortDecimal: 8,
            tokenName: "tName1",
            tokenSymbol: "ICP"
        }];

        const updatedAssets = await serviceRepository.addServiceAssets("service-5", newAssets);

        expect(updatedAssets).toHaveLength(1);
        expect(serviceDataStorage.updateItem).toHaveBeenCalledWith({ principal: "service-5", name: "Service", assets: newAssets });
    });

    it("ServiceRepository:addServiceAssets should throw error if asset already exists", async () => {
        const existingService: ServiceModel = {
            principal: "service-6", name: "Service", assets: [{
                ledgerAddress: "ledger-1",
                decimal: 8,
                logo: "",
                shortDecimal: 8,
                tokenName: "tName1",
                tokenSymbol: "ICP"
            }]
        };
        serviceDataStorage.getItem.mockResolvedValue(existingService);

        const newAssets: AddServiceAssetForm[] = [{
            ledgerAddress: "ledger-1",
            decimal: 8,
            logo: "",
            shortDecimal: 8,
            tokenName: "tName1",
            tokenSymbol: "ICP"
        }];

        await expect(serviceRepository.addServiceAssets("service-6", newAssets)).rejects.toThrow(ValidationError);
    });

    it("ServiceRepository:removeServiceAsset should remove an asset from a service", async () => {
        const existingService: ServiceModel = {
            principal: "service-7", name: "Service", assets: [{
                ledgerAddress: "ledger-1",
                decimal: 8,
                logo: "",
                shortDecimal: 8,
                tokenName: "tName1",
                tokenSymbol: "ICP"
            }]
        };
        serviceDataStorage.getItem.mockResolvedValue(existingService);

        await serviceRepository.removeServiceAsset("service-7", "ledger-1");

        expect(serviceDataStorage.updateItem).toHaveBeenCalledWith({ principal: "service-7", name: "Service", assets: [] });
    });

    it("ServiceRepository:removeServiceAsset should throw error if asset does not exist", async () => {
        const existingService: ServiceModel = { principal: "service-8", name: "Service", assets: [] };
        serviceDataStorage.getItem.mockResolvedValue(existingService);

        await expect(serviceRepository.removeServiceAsset("service-8", "ledger-2")).rejects.toThrow(ValidationError);
    });

    it("ServiceRepository:isServiceExist should return true if service exists", async () => {
        serviceDataStorage.getItem.mockResolvedValue({ principal: "service-9", name: "Service", assets: [] });

        const result = await serviceRepository.isServiceExist("service-9");

        expect(result).toBe(true);
    });

    it("ServiceRepository:isServiceExist should return false if service does not exist", async () => {
        serviceDataStorage.getItem.mockResolvedValue(undefined);

        const result = await serviceRepository.isServiceExist("service-10");

        expect(result).toBe(false);
    });

    it("ServiceRepository:updateServiceName should update service name", async () => {

        serviceDataStorage.getItem.mockResolvedValue(undefined);

        const error = new ValidationError("service.not.exists",
            "principal",
            `Service not exists. Principal: principal-1`);

        await expect(serviceRepository["getServiceByPrincipal"]("principal-1")).rejects.toThrow(error);

    });
});
