import { LocalDataStorage } from "@app/storages/localDataStorage";
import { jsonParse, jsonStringify } from "@ic-wallet-middleware/common";


export abstract class BaseConsoleLocalStorage<T> {

    constructor(private localDataStorage: LocalDataStorage) {
    }

    protected abstract get collectionName(): string;

    public abstract getDocumentId(doc: T): string;

    public getItems(): Promise<T[]> {
        const data = this.localDataStorage.getItem(this.collectionName);

        return Promise.resolve(data ? jsonParse(data) : []);
    }

    public async getItem(documentId: string): Promise<T | undefined> {
        const items = await this.getItems();
        return this.getItemFromCollection(items, documentId);
    }

    public async addItem(document: T): Promise<void> {
        await this.addItems([document]);
    }

    public async addItems(documents: T[]): Promise<void> {
        const items = await this.getItems();
        items.push(...documents);
        this.saveItems(items);
    }

    public async updateItem(document: T): Promise<void> {
        await this.updateItems([document]);
    }

    public async updateItems(documents: T[]): Promise<void> {
        let items = await this.getItems();
        for (const item of documents) {
            items = items.filter((i) => this.getDocumentId(i) != this.getDocumentId(item));
        }
        items.push(...documents);
        this.saveItems(items);
    }

    public async deleteItem(documentId: string): Promise<void> {
        let items = await this.getItems();

        items = items.filter(i => this.getDocumentId(i) != documentId);

        this.saveItems(items);
    }

    private getItemFromCollection(items: T[], documentId: string): T | undefined {
        return items.find(i => this.getDocumentId(i) == documentId);
    }

    private saveItems(items: T[]): void {
        const data = jsonStringify(items);
        this.localDataStorage.setItem(this.collectionName, data);
    }

}
