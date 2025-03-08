import { EditHplAccountForm } from "@hpl/forms/accounts/editHplAccountForm";
import { IHplAccountDataStorage } from "@hpl/storage/hplAccountDataStorage";
import { HplAccountDataModel } from "@hpl/types/accounts/hplAccountDataModel";
import { ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service("HplAccountRepository")
export class HplAccountRepository {
    private hplAccountDataStorage: IHplAccountDataStorage

    constructor(
        @Inject("IHplAccountDataStorage")
        hplAccountDataStorage: IHplAccountDataStorage) {
        this.hplAccountDataStorage = hplAccountDataStorage;
    }

    public async getAccounts(): Promise<HplAccountDataModel[]> {
        return await this.hplAccountDataStorage.getItems();
    }


    public async addAccount(account: HplAccountDataModel) {
        await this.hplAccountDataStorage.addItem(account);
    }

    public async updateAccount(account: EditHplAccountForm): Promise<HplAccountDataModel> {
        const item = await this.getAccountById(account.accountId);
        item.name = account.name;
        await this.hplAccountDataStorage.updateItem(item);
        return item;
    }

    public async removeAccount(accountId: string) {
        await this.hplAccountDataStorage.deleteItem(accountId);
    }

    async isAccountExist(accountId: string): Promise<boolean> {
        const account = await this.hplAccountDataStorage.getItem(accountId);
        const result = account ? true : false;
        return result;
    }

    private async getAccountById(accountId: string): Promise<HplAccountDataModel> {
        const account = await this.hplAccountDataStorage.getItem(accountId);
        if (!account) {
            throw new ValidationError("account.not.exists",
                "accountId",
                `Account not exists. AccountId: ${accountId}`);
        }
        return account
    }
}