import { ILogger } from "@common/logger";
import { IdentifierService } from "@common/services";
import { BaseRxDbDocument } from "@common/storage/baseRxDbDocument";
import "reflect-metadata";
import { RxCollection, RxDocument } from "rxdb";
export interface IBaseDataStorage<T> {
    get collectionName(): string;
    getItems(): Promise<T[]>;
    getItem(documentId: string): Promise<T | undefined>;
    addItem(document: T): Promise<void>;
    addItems(documents: T[]): Promise<void>;
    updateItem(document: T): Promise<void>;
    updateItems(documents: T[]): Promise<void>;
    deleteItem(documentId: string): Promise<void>;
}
export type CollectionRxDocument = RxDocument<BaseRxDbDocument>;
export declare const updateAt: () => number;
export declare abstract class BaseDataStorage<TObject, TContext> implements IBaseDataStorage<TObject> {
    protected identifierService: IdentifierService;
    protected context: TContext;
    abstract get collectionName(): string;
    abstract getDocumentId(doc: TObject): string;
    protected logger: ILogger;
    constructor(logger: ILogger, identifierService: IdentifierService, context: TContext);
    get collection(): RxCollection;
    getItem(documentId: string): Promise<TObject | undefined>;
    getItems(): Promise<TObject[]>;
    addItem(document: TObject): Promise<void>;
    addItems(documents: TObject[]): Promise<void>;
    updateItem(document: TObject): Promise<void>;
    updateItems(documents: TObject[]): Promise<void>;
    deleteItem(documentId: string): Promise<void>;
    protected mapDocToModel(item: CollectionRxDocument): TObject;
}
