import { RxBaseDataStorage } from "@hpl/storage/base/rxBaseDataStorage";
import { HplAccountDataModel } from "@hpl/types/accounts/hplAccountDataModel";
import { IBaseDataStorage } from "@ic-wallet-middleware/common";

import "reflect-metadata";
import { Service } from "typedi";


export interface IHplAccountDataStorage extends IBaseDataStorage<HplAccountDataModel> {
}

@Service("IHplAccountDataStorage")
export class HplAccountDataStorage extends RxBaseDataStorage<HplAccountDataModel> implements IHplAccountDataStorage {
    public get collectionName(): string {
       return "hplAccounts";
    }

    public getDocumentId(doc: HplAccountDataModel): string {
        return doc.id;
    }
}