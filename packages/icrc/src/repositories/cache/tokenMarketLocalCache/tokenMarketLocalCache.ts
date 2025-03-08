import { ILocalCacheStorage, ILogger, IStorage, jsonParse, jsonStringify } from "@ic-wallet-middleware/common";
import { TokenMarketInfo } from "@icrc/types/assets";
import { Inject, Service } from "typedi";

@Service()
export class TokenMarketLocalCache implements ILocalCacheStorage {

    constructor(
        @Inject("ILogger")
        private logger: ILogger,
        @Inject("IStorage")
        private storage: IStorage
    ) {

    }

    setTokenMarkets(tokens: TokenMarketInfo[]): void {
        const key = this.getKey();
        this.storage.setItem(key, jsonStringify(tokens));
    }

    getTokenMarkets(): TokenMarketInfo[] | undefined {
        const key = this.getKey();
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: TokenMarketInfo[] = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, `Wrong local cache data ${this.constructor.name}`, [value, key])
                return [];
            }
        }
        return undefined;
    }

    private getKey(): string {
        return `tokenMarkets`;
    }
}