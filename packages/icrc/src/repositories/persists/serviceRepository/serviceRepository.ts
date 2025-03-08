import { ValidationError } from "@ic-wallet-middleware/common";
import { IServiceDataStorage } from "@icrc/storage";
import { AddServiceAssetForm } from "@icrc/types/forms";
import { ServiceAssetModel, ServiceModel } from "@icrc/types/services";
import { Inject, Service } from "typedi";

@Service("ServiceRepository")
export class ServiceRepository {
    private serviceDataStorage: IServiceDataStorage

    constructor(
        @Inject("IServiceDataStorage")
        serviceDataStorage: IServiceDataStorage) {
        this.serviceDataStorage = serviceDataStorage;
    }

    public async getServices(): Promise<ServiceModel[]> {
        return await this.serviceDataStorage.getItems();
    }

    public async addService(service: ServiceModel) {
        await this.serviceDataStorage.addItem(service);
    }

    public async updateServiceName(principal: string, newName: string): Promise<ServiceModel> {
        const service = await this.getServiceByPrincipal(principal);
        service.name = newName;
        await this.serviceDataStorage.updateItem(service);
        return service;
    }

    public async removeService(principal: string) {
        await this.serviceDataStorage.deleteItem(principal);
    }

    public async addServiceAssets(servicePrincipal: string, assets: AddServiceAssetForm[]): Promise<ServiceAssetModel[]> {
        const service = await this.getServiceByPrincipal(servicePrincipal);

        assets.forEach((ast) => {
            const asset = service.assets.find((a) => a.ledgerAddress === ast.ledgerAddress.toString());
            if (asset) {
                throw new ValidationError("service.asset.already.exists",
                    "ledgerAddress",
                    `Asset already exists. Asset: ${ast.ledgerAddress}`);
            }
            service.assets.push(ast);
        })

        await this.serviceDataStorage.updateItem(service);
        return service.assets;
    }

    public async removeServiceAsset(servicePrincipal: string, ledgerAddress: string): Promise<void> {
        const service = await this.getServiceByPrincipal(servicePrincipal);
        const item = service.assets.find((a) => a.ledgerAddress === ledgerAddress);
        if (!item) {
            throw new ValidationError("service.asset.not.exists",
                "ledgerAddress",
                `Asset not exists. Asset: ${ledgerAddress}`);
        }
        service.assets = service.assets.filter((a) => a.ledgerAddress !== ledgerAddress);
        await this.serviceDataStorage.updateItem(service);
    }

    async isServiceExist(serviceId: string): Promise<boolean> {
        const service = await this.serviceDataStorage.getItem(serviceId);
        const result = service ? true : false;
        return result;
    }

    private async getServiceByPrincipal(principal: string): Promise<ServiceModel> {
        const service = await this.serviceDataStorage.getItem(principal);
        if (!service) {
            throw new ValidationError("service.not.exists",
                "principal",
                `Service not exists. Principal: ${principal}`);
        }
        return service
    }
}