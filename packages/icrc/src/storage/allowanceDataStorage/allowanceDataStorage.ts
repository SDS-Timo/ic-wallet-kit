import { IBaseDataStorage } from "@ic-wallet-middleware/common";
import { RxBaseDataStorage } from "@icrc/storage/base/rxBaseDataStorage";
import { AllowanceStorageModel } from "@icrc/types/allowances/allowanceStorageModel";

export interface IAllowanceDataStorage extends IBaseDataStorage<AllowanceStorageModel> {
}

export class AllowanceDataStorage extends RxBaseDataStorage<AllowanceStorageModel> implements IAllowanceDataStorage {

    public get collectionName(): string {
        return "allowances";
    }

    public getDocumentId(doc: AllowanceStorageModel): string {
        return `${doc.spenderPrincipal}_${doc.ledgerAddress}_${doc.subAccountId}_${doc.spenderSubId}`;
    }
}