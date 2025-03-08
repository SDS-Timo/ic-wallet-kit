import { RxBaseDataStorage } from "@hpl/storage/base/rxBaseDataStorage";
import { HplContactDataModel } from "@hpl/types";
import { IBaseDataStorage } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Service } from "typedi";


export interface IHplContactDataStorage extends IBaseDataStorage<HplContactDataModel> {
}

@Service("IHplContactDataStorage")
export class HplContactDataStorage extends RxBaseDataStorage<HplContactDataModel> implements IHplContactDataStorage {

    get collectionName(): string {
        return "hplContacts";
    }

    public getDocumentId(doc: HplContactDataModel): string {
        return doc.principal;
    }
}