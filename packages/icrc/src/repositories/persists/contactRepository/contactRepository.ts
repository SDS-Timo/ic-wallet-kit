import { ValidationError } from "@ic-wallet-middleware/common";
import { IContactDataStorage } from "@icrc/storage/contactDataStorage/contactDataStorage";
import { AddAssetContactForm } from "@icrc/types/contacts/addAssetContactForm";
import { AddSubAccountContactForm } from "@icrc/types/contacts/addSubAccountContactForm";
import { AssetContactModel } from "@icrc/types/contacts/assetContactModel";
import { ContactModel } from "@icrc/types/contacts/contactModel";
import { EditSubAccountContactForm } from "@icrc/types/contacts/editSubAccountContactForm";
import { RemoveAssetContactForm } from "@icrc/types/contacts/removeAssetContactForm";
import { RemoveSubAccountContactForm } from "@icrc/types/contacts/removeSubAccountContactForm";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service("ContactRepository")
export class ContactRepository {
    private contactDataStorage: IContactDataStorage

    constructor(
        @Inject("IContactDataStorage")
        contactDataStorage: IContactDataStorage) {
        this.contactDataStorage = contactDataStorage;
    }

    public async getContacts(): Promise<ContactModel[]> {
        return await this.contactDataStorage.getItems();
    }

    public async addContact(contact: ContactModel) {
        await this.contactDataStorage.addItem(contact);
    }

    public async updateContactName(principal: string, newName: string): Promise<ContactModel> {
        const contact = await this.getContactByPrincipal(principal);
        contact.name = newName;
        await this.contactDataStorage.updateItem(contact);
        return contact;
    }

    public async removeContact(principal: string) {
        await this.contactDataStorage.deleteItem(principal);
    }

    public async addAssetContact(form: AddAssetContactForm): Promise<ContactModel> {
        const contact = await this.getContactByPrincipal(form.principal);

        const asset = contact.assets.find((a) => a.ledgerAddress === form.ledgerAddress);
        if (asset) {
            throw new ValidationError("contact.asset.already.exists",
                "ledgerAddress",
                `Asset already exists. Ledger address: ${form.ledgerAddress}`);
        }

        const newAsset: AssetContactModel = {
            ledgerAddress: form.ledgerAddress,
            subAccounts: []
        };
        contact.assets.push(newAsset);
        await this.contactDataStorage.updateItem(contact);
        return contact;
    }

    public async removeAssetContact(form: RemoveAssetContactForm): Promise<ContactModel> {
        const contact = await this.getContactByPrincipal(form.principal);
        contact.assets = contact.assets.filter((a) => a.ledgerAddress !== form.ledgerAddress);
        await this.contactDataStorage.updateItem(contact);
        return contact;
    }

    public async addSubAccountContact(form: AddSubAccountContactForm): Promise<ContactModel> {
        const contact = await this.getContactByPrincipal(form.principal);

        const asset = this.getContactAsset(contact, form.ledgerAddress);
        const subAccountId = form.subAccountId.toString();
        const subAccount = asset.subAccounts.find((sa) => sa.subAccountId === subAccountId);

        if (subAccount) {
            throw new ValidationError("adding.contact.subaccount.already.exists",
                "oldSubAccountId",
                `SubAccount already exists. SubAccountId: ${form.subAccountId.toString()}`);
        }
        const newSubAccount = {
            name: form.subAccountName,
            subAccountId: subAccountId
        };
        asset.subAccounts.push(newSubAccount);
        await this.contactDataStorage.updateItem(contact);
        return contact;
    }

    public async updateSubAccountContact(form: EditSubAccountContactForm): Promise<ContactModel> {
        const contact = await this.getContactByPrincipal(form.principal);

        const asset = this.getContactAsset(contact, form.ledgerAddress);
        const subAccount = asset.subAccounts.find((sa) => sa.subAccountId === form.oldSubAccountId.toString());

        if (!subAccount) {
            throw new ValidationError("updating.contact.subaccount.not.exists",
                "oldSubAccountId",
                `SubAccount not exists. SubAccountId: ${form.oldSubAccountId.toString()}`);
        }

        if (form.newSubAccountId.notEquals(form.oldSubAccountId)) {
            const existSubAccountId = asset.subAccounts.find((sa) => sa.subAccountId === form.newSubAccountId.toString());

            if (existSubAccountId) {
                throw new ValidationError("updating.contact.subaccount.index.already.exists",
                    "newSubAccountIndex",
                    `newSubAccountIndex already exists. SubAccountId: ${form.newSubAccountId.toString()}`);
            }
        }

        subAccount.name = form.newSubAccountName;
        subAccount.subAccountId = form.newSubAccountId.toString();
        await this.contactDataStorage.updateItem(contact);
        return contact;
    }

    public async removeSubAccountContact(form: RemoveSubAccountContactForm): Promise<ContactModel> {
        const contact = await this.getContactByPrincipal(form.principal);

        const asset = this.getContactAsset(contact, form.ledgerAddress);
        asset.subAccounts = asset.subAccounts.filter((sa) => sa.subAccountId !== form.subAccountId.toString());

        await this.contactDataStorage.updateItem(contact);
        return contact;
    }

    public async removeAssetFromAllContacts(ledgerAddress: string): Promise<void> {
        const contacts = await this.getContacts();
        for (const contact of contacts) {
            contact.assets = contact.assets.filter((a) => a.ledgerAddress !== ledgerAddress);
        }
        await this.contactDataStorage.updateItems(contacts);

    }

    async isContactExist(contactId: string): Promise<boolean> {
        const contact = await this.contactDataStorage.getItem(contactId);
        const result = contact ? true : false;
        return result;
    }

    public async getContactByPrincipal(principal: string): Promise<ContactModel> {
        const contact = await this.contactDataStorage.getItem(principal);
        if (!contact) {
            throw new ValidationError("contact.not.exists",
                "principal",
                `Contact not exists. Principal: ${principal}`);
        }
        return contact
    }

    public getContactAssetOrDefault(contact: ContactModel, ledgerAddress: string): AssetContactModel | undefined {
        const asset = contact.assets.find((a) => a.ledgerAddress === ledgerAddress);
        return asset;
    }

    public getContactAsset(contact: ContactModel, ledgerAddress: string): AssetContactModel {
        const asset = this.getContactAssetOrDefault(contact, ledgerAddress);
        if (!asset) {
            throw new ValidationError("contact.asset.not.exists",
                "ledgerAddress",
                `Asset not exists. Ledger address: ${ledgerAddress}`);
        }
        return asset;
    }
}