import { BaseConsoleLocalStorage } from "@app/storages/baseConsoleLocalStorage";
import { AllowanceStorageModel, IAllowanceDataStorage } from "@ic-wallet-kit/icrc";


export class AllowanceConsoleStorage extends BaseConsoleLocalStorage<AllowanceStorageModel> implements IAllowanceDataStorage {

    public get collectionName(): string {
        return "persists-allowances";
    }

    public getDocumentId(doc: AllowanceStorageModel): string {
        return `${doc.spenderPrincipal}_${doc.ledgerAddress}_${doc.subAccountId}_${doc.spenderSubId}`;
    }
}
