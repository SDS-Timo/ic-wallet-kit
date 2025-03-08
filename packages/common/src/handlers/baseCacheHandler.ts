import { CacheDataError } from "@common/errors/cacheDataError";
import { BaseHandler } from "@common/handlers/baseHandler";
import { ILogger } from "@common/logger/logger";

import { Inject, Service } from "typedi";

export interface IInfo extends ILoadForce {
}

export enum LoadType {
    Full = 1,
    Quick = 2,
    Cache = 3
}

export interface ILoadForce {
    loadType: LoadType;
}

@Service()
export abstract class BaseCacheDataHandler<
    TInfo extends IInfo,
    TResult,
> extends BaseHandler<TInfo, TResult> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
    ) {
        super(logger);
    }

    abstract validate(form: TInfo): Promise<void>;

    abstract getLocalCacheData(info: TInfo): Promise<TResult | undefined>;

    abstract getExternalData(info: TInfo): Promise<TResult>;

    abstract updateField(info: TInfo, data: TResult): void;

    abstract getCacheDataError(info: TInfo): CacheDataError;

    abstract getLoadForceType(): LoadType[];

    async process(info: TInfo): Promise<TResult> {
        if (this.isExternalData(info)) {
            return await this.getInternalIcrcData(info, false);
        }

        const localResult = await this.getLocalCacheData(info);
        if (localResult) {
            return localResult;
        }
        return await this.getInternalIcrcData(info, true);
    }

    private isExternalData(info: TInfo): boolean {
        const result = this.getLoadForceType().includes(info.loadType);
        return result;
    }

    private async getInternalIcrcData(
        info: TInfo,
        icrcFail: boolean
    ): Promise<TResult> {
        try {
            const result = await this.getExternalData(info);
            this.updateField(info, result);
            return result;
        } catch (e: any) {
            if (e.message && e.message.toString().indexOf("fetch failed") !== -1) {
                if (!icrcFail) {
                    const localResult = await this.getLocalCacheData(info);
                    if (localResult) {
                        return localResult;
                    }
                }
                throw this.getCacheDataError(info);
            }
            throw e;
        }
    }
}


export abstract class BaseCacheDataHandlerV2<
    TInfo extends IInfo,
    TResult,
> {
    constructor(
        protected logger: ILogger,
    ) {
    }

    abstract getLocalCacheData(info: TInfo): Promise<TResult | undefined>;

    abstract getExternalData(info: TInfo): Promise<TResult>;

    abstract updateField(info: TInfo, data: TResult): void;

    abstract getCacheDataError(info: TInfo): CacheDataError;

    abstract getLoadForceType(): LoadType[];

    public async handle(form: TInfo): Promise<TResult> {
        if (this.isExternalData(form)) {
            return await this.getInternalIcrcData(form, false);
        }

        const localResult = await this.getLocalCacheData(form);
        if (localResult) {
            return localResult;
        }
        return await this.getInternalIcrcData(form, true);
    }

    private isExternalData(info: TInfo): boolean {
        const result = this.getLoadForceType().includes(info.loadType);
        return result;
    }

    private async getInternalIcrcData(
        info: TInfo,
        icrcFail: boolean
    ): Promise<TResult> {
        try {
            const result = await this.getExternalData(info);
            this.updateField(info, result);
            return result;
        } catch (e: any) {
            if (e.message && e.message.toString().indexOf("fetch failed") !== -1) {
                if (!icrcFail) {
                    const localResult = await this.getLocalCacheData(info);
                    if (localResult) {
                        return localResult;
                    }
                }
                throw this.getCacheDataError(info);
            }
            throw e;
        }
    }
}
