
import { RxDbRepositoryError } from "@common/errors";
import { ILogger } from "@common/logger";
import { IdentifierService } from "@common/services";
import { BaseRxDbDocument } from "@common/storage/baseRxDbDocument";
import { jsonParse } from "@common/utils";

import "reflect-metadata";
import { RxCollection, RxDocument } from "rxdb";
import { Inject, Service } from "typedi";


export interface IBaseDataStorage<T> {

    get collectionName(): string;
    getItems(): Promise<T[]>;
    getItem(documentId: string): Promise<T | undefined>;
    addItem(document: T): Promise<void>;
    addItems(documents: T[]): Promise<void>;
    updateItem(document: T): Promise<void>;
    updateItems(documents: T[]): Promise<void>
    deleteItem(documentId: string): Promise<void>;
}

export type CollectionRxDocument = RxDocument<BaseRxDbDocument>;

const jsonStringify = (data: any): string => {
    const replacer = (key: any, value: any) => typeof value === "bigint" ? value.toString() : value;
    return JSON.stringify(data, replacer);
}

export const updateAt = (): number => {
    return Math.floor(Date.now() / 1000);
}

@Service()
export abstract class BaseDataStorage<TObject, TContext> implements IBaseDataStorage<TObject> {

    public abstract get collectionName(): string;

    public abstract getDocumentId(doc: TObject): string;

    protected logger: ILogger;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        protected identifierService: IdentifierService,
        protected context: TContext
    ) {
        this.logger = logger;
    }

    public get collection(): RxCollection {
        return (<any>this.context).db.collections[this.collectionName];
    }

    public async getItem(documentId: string): Promise<TObject | undefined> {
        try {
            const doc = await this.collection.findOne(documentId).exec();
            if (doc) {
                const result = this.mapDocToModel(doc);
                return result;
            }
            return undefined;
        }
        catch (e: any) {
            throw new RxDbRepositoryError("document.get.item.error", e.message);
        }
    }

    public async getItems(): Promise<TObject[]> {
        try {

            const docs = await this.collection.find().exec();
            let result: TObject[] = docs?.map((doc: any) => { return this.mapDocToModel(doc); }) ?? [];

            return result;
        }
        catch (e: any) {
            throw new RxDbRepositoryError("document.get.items.error", e.message);
        }
    }

    public async addItem(document: TObject): Promise<void> {
        try {
            const doc: BaseRxDbDocument = {
                id: this.getDocumentId(document),
                deleted: false,
                updatedAt: updateAt(),
                payload: jsonStringify(document)
            }
            await this.collection.insert(doc);
        }
        catch (e: any) {
            throw new RxDbRepositoryError("document.add.error", e.message);
        }
    }

    public async addItems(documents: TObject[]): Promise<void> {
        try {
            const docs: BaseRxDbDocument[] = documents.map((d: TObject) => {
                return {
                    id: this.getDocumentId(d),
                    deleted: false,
                    updatedAt: updateAt(),
                    payload: jsonStringify(d)
                }
            })
            await this.collection.bulkInsert(docs);
        }
        catch (e: any) {
            throw new RxDbRepositoryError("document.add.error", e.message);
        }
    }

    public async updateItem(document: TObject): Promise<void> {
        try {

            const doc = await this.collection.findOne(this.getDocumentId(document)).exec();
            await doc.patch({
                updatedAt: updateAt(),
                payload: jsonStringify(document)
            })
        }
        catch (e: any) {
            throw new RxDbRepositoryError("document.update.error", e.message);
        }
    }

    public async updateItems(documents: TObject[]): Promise<void> {
        try {
            const docs: BaseRxDbDocument[] = documents.map((d: TObject) => {
                return {
                    id: this.getDocumentId(d),
                    deleted: false,
                    updatedAt: updateAt(),
                    payload: jsonStringify(d)
                }
            })
            await this.collection.bulkUpsert(docs);
        }
        catch (e: any) {
            throw new RxDbRepositoryError("document.update.error", e.message);
        }
    }

    public async deleteItem(documentId: string): Promise<void> {
        const doc = await this.collection.findOne(documentId).exec();
        if (!doc) {
            throw new RxDbRepositoryError("document.delete.error", "document not found");
        }
        await doc.remove();
    }

    protected mapDocToModel(item: CollectionRxDocument): TObject {

        try {
            const result: TObject = jsonParse(item.payload);

            return result;
        }
        catch (e) {
            this.logger.logError(e);
            throw e;
        }

    }
}