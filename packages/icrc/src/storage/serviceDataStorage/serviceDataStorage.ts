
import { IBaseDataStorage } from "@ic-wallet-middleware/common";
import { RxBaseDataStorage } from "@icrc/storage/base/rxBaseDataStorage";
import { ServiceModel } from "@icrc/types/services";

export interface IServiceDataStorage extends IBaseDataStorage<ServiceModel> {
}

export class ServiceDataStorage extends RxBaseDataStorage<ServiceModel> implements IServiceDataStorage {
    get collectionName(): string {
        return "services";
    }

    public getDocumentId(doc: ServiceModel): string {
        return doc.principal;
    }
}