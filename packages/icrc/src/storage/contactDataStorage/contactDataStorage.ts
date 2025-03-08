
import { IBaseDataStorage } from "@ic-wallet-kit/common";
import { RxBaseDataStorage } from "@icrc/storage/base/rxBaseDataStorage";
import { ContactModel } from "@icrc/types/contacts/contactModel";

export interface IContactDataStorage extends IBaseDataStorage<ContactModel> {
}

export class ContactDataStorage extends RxBaseDataStorage<ContactModel> implements IContactDataStorage {
    get collectionName(): string {
        return "contacts";
    }

    public getDocumentId(doc: ContactModel): string {
        return doc.principal;
    }
}