import { BaseConsoleLocalStorage } from "@app/storages/baseConsoleLocalStorage";
import { ContactModel, IContactDataStorage } from "@ic-wallet-middleware/icrc";


export class ContactConsoleStorage extends BaseConsoleLocalStorage<ContactModel> implements IContactDataStorage {
    get collectionName(): string {
        return "persists-contacts";
    }

    public getDocumentId(doc: ContactModel): string {
        return doc.principal;
    }
}
