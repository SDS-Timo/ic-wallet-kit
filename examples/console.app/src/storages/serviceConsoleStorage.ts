import { BaseConsoleLocalStorage } from "@app/storages/baseConsoleLocalStorage";
import { IServiceDataStorage, ServiceModel } from "@ic-wallet-middleware/icrc";


export class ServiceConsoleStorage extends BaseConsoleLocalStorage<ServiceModel> implements IServiceDataStorage {
    get collectionName(): string {
        return "persists-services";
    }

    public getDocumentId(doc: ServiceModel): string {
        return doc.principal;
    }
}