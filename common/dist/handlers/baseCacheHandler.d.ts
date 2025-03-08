import { CacheDataError } from "@common/errors/cacheDataError";
import { BaseHandler } from "@common/handlers/baseHandler";
import { ILogger } from "@common/logger/logger";
import "reflect-metadata";
export interface IInfo extends ILoadForce {
}
export interface ILoadForce {
    force: boolean;
}
export declare abstract class BaseCacheDataHandler<TInfo extends IInfo, TResult> extends BaseHandler<TInfo, TResult> {
    constructor(logger: ILogger);
    abstract validate(form: TInfo): Promise<void>;
    abstract getLocalCacheData(info: TInfo): Promise<TResult | undefined>;
    abstract getIcrcData(info: TInfo): Promise<TResult>;
    abstract updateField(info: TInfo, data: TResult): void;
    abstract getCacheDataError(info: TInfo): CacheDataError;
    process(info: TInfo): Promise<TResult>;
    private getInternalIcrcData;
}
