
import { ValidationError } from "@ic-wallet-middleware/common";
import { IAllowanceDataStorage } from "@icrc/storage/allowanceDataStorage/allowanceDataStorage";
import { AllowanceStorageModel } from "@icrc/types/allowances/allowanceStorageModel";
import { CheckAllowanceForm, RemoveAllowanceForm } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class AllowanceRepository {

    constructor(
        @Inject("IAllowanceDataStorage")
        private allowanceDataStorage: IAllowanceDataStorage) {
    }

    public async getAssetAllowances(ledgerAddress: string): Promise<AllowanceStorageModel[]> {
        const storageAllowances = await this.allowanceDataStorage.getItems();
        const allowances = storageAllowances.filter((a) => a.ledgerAddress === ledgerAddress);
        return allowances;
    }

    public async getAssetAllowance(spenderPrincipal: string,
        ledgerAddress: string,
        subAccountId: string,
        spenderSubId: string): Promise<AllowanceStorageModel> {
        const documentId = this.getAllowanceDocumentId(spenderPrincipal,
            ledgerAddress,
            subAccountId,
            spenderSubId)
        const storageAllowance = await this.allowanceDataStorage.getItem(documentId);
        if (!storageAllowance) {
            throw new ValidationError("allowance.not.found", "", "Allowance Not Found")
        }
        return storageAllowance;
    }

    public async addAllowance(model: CheckAllowanceForm): Promise<AllowanceStorageModel> {
        const newAllowance = {
            spenderPrincipal: model.spenderPrincipal,
            spenderSubId: model.spenderSubId.toString(),
            ledgerAddress: model.ledgerAddress,
            subAccountId: model.subAccountId.toString()
        };
        await this.allowanceDataStorage.addItem(newAllowance)

        return newAllowance;
    }

    public async removeAllowance(form: RemoveAllowanceForm) {
        await this.allowanceDataStorage.deleteItem(
            this.getAllowanceDocumentId(form.spenderPrincipal, form.ledgerAddress, form.subAccountId.toString(), form.spenderSubId.toString()));
    }

    public async isExistStorageAllowance(spenderPrincipal: string,
        ledgerAddress: string,
        subAccountId: string,
        spenderSubId: string): Promise<boolean> {
        const id = this.getAllowanceDocumentId(spenderPrincipal, ledgerAddress, subAccountId, spenderSubId)
        const item = await this.allowanceDataStorage.getItem(id);
        return item ? true : false;
    }

    private getAllowanceDocumentId(spenderPrincipal: string,
        ledgerAddress: string,
        subAccountId: string,
        spenderSubId: string): string {
        return `${spenderPrincipal}_${ledgerAddress}_${subAccountId}_${spenderSubId}`

    }
}