import { IHplVirtualAccountDataStorage } from "@hpl/storage/hplVirtualAccountDataStorage";
import { HplVirtualAccountDataModel } from "@hpl/types/virtualAccounts/hplVirtualAccountDataModel";
import { ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service("HplVirtualAccountRepository")
export class HplVirtualAccountRepository {
    private hplVirtualAccountDataStorage: IHplVirtualAccountDataStorage

    constructor(
        @Inject("IHplVirtualAccountDataStorage")
        hplVirtualAccountDataStorage: IHplVirtualAccountDataStorage) {
        this.hplVirtualAccountDataStorage = hplVirtualAccountDataStorage;
    }

    public async getVirtualAccounts(): Promise<HplVirtualAccountDataModel[]> {
        return await this.hplVirtualAccountDataStorage.getItems();
    }

    public async addVirtualAccount(virtualAccount: HplVirtualAccountDataModel) {
        await this.hplVirtualAccountDataStorage.addItem(virtualAccount);
    }

    public async updateVirtualAccount(virtualAccount: HplVirtualAccountDataModel): Promise<HplVirtualAccountDataModel> {
        const item = await this.getVirtualAccountById(virtualAccount.id.toString());
        item.name = virtualAccount.name;
        await this.hplVirtualAccountDataStorage.updateItem(item);
        return item;
    }

    public async removeVirtualAccount(virtualAccountId: string) {
        await this.hplVirtualAccountDataStorage.deleteItem(virtualAccountId);
    }

    async isVirtualAccountExist(virtualAccountId: string): Promise<boolean> {
        const virtualAccount = await this.hplVirtualAccountDataStorage.getItem(virtualAccountId);
        const result = virtualAccount ? true : false;
        return result;
    }

    private async getVirtualAccountById(virtualAccountId: string): Promise<HplVirtualAccountDataModel> {
        const virtualAccount = await this.hplVirtualAccountDataStorage.getItem(virtualAccountId);
        if (!virtualAccount) {
            throw new ValidationError("virtualAccount.not.exists",
                "virtualAccountId",
                `VirtualAccount not exists. VirtualAccountId: ${virtualAccountId}`);
        }
        return virtualAccount
    }
}