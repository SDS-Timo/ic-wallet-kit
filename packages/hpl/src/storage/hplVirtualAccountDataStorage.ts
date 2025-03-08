import { RxBaseDataStorage } from "@hpl/storage/base/rxBaseDataStorage";
import { HplVirtualAccountDataModel } from "@hpl/types/virtualAccounts/hplVirtualAccountDataModel";
import { IBaseDataStorage } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Service } from "typedi";

export interface IHplVirtualAccountDataStorage extends IBaseDataStorage<HplVirtualAccountDataModel> {
}

@Service("IHplVirtualAccountDataStorage")
export class HplVirtualAccountDataStorage extends RxBaseDataStorage<HplVirtualAccountDataModel> implements IHplVirtualAccountDataStorage {

    public get collectionName(): string {
        return "hplVirtualAccounts";
    }

    public getDocumentId(doc: HplVirtualAccountDataModel): string {
        return doc.id;
    }
}