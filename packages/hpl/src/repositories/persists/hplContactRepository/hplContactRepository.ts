import { IHplContactDataStorage } from "@hpl/storage/hplContactDataStorage";
import { HplContactDataModel } from "@hpl/types";
import { HplContactRemoteDataModel } from "@hpl/types/contacts/hplContactRemoteDataModel";
import { ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service("HplContactRepository")
export class HplContactRepository {
    private hplContactDataStorage: IHplContactDataStorage

    constructor(
        @Inject("IHplContactDataStorage")
        hplContactDataStorage: IHplContactDataStorage) {
        this.hplContactDataStorage = hplContactDataStorage;
    }

    public async getContacts(): Promise<HplContactDataModel[]> {
        return await this.hplContactDataStorage.getItems();
    }

    public async getContactById(contactId: string): Promise<HplContactDataModel> {
        return await this.getContactByIdInternal(contactId);
    }

    public async addContact(contact: HplContactDataModel) {
        await this.hplContactDataStorage.addItem(contact);
    }

    public async updateContact(contact: HplContactDataModel): Promise<HplContactDataModel> {
        await this.hplContactDataStorage.updateItem(contact);
        return contact;
    }

    public async addContactRemotes(contactId: string, remotes: HplContactRemoteDataModel[]) {
        const item = await this.getContactByIdInternal(contactId);
        item.remotes = item.remotes.concat(item.remotes, remotes);
        await this.hplContactDataStorage.updateItem(item);
    }

    public async removeContact(contactId: string) {
        await this.hplContactDataStorage.deleteItem(contactId);
    }

    public async removeContactLink(contactId: string, linkId: string) {
        const item = await this.getContactByIdInternal(contactId);
        item.remotes = item.remotes.filter((r) => r.remoteId !== linkId);
        await this.hplContactDataStorage.updateItem(item);
    }

    private async getContactByIdInternal(contactId: string): Promise<HplContactDataModel> {
        const contact = await this.hplContactDataStorage.getItem(contactId);
        if (!contact) {
            throw new ValidationError("contact.not.exists",
                "contactId",
                `FtContact not exists. ContactId: ${contactId}`);
        }
        return contact
    }
}