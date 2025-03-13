import { ILogger, IStorage, IdentifierService, jsonParse, jsonStringify } from "@ic-wallet-kit/common";
import { TokenModel } from "@icrc/wrappers/tokenModel";
import { Inject, Service } from "typedi";

@Service()
export class TokenLocalCache {

    constructor(
        @Inject("ILogger")
        private logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IStorage")
        private storage: IStorage
    ) {

    }

    setTokens(tokens: TokenModel[]): void {
        const key = this.getKey();
        this.storage.setItem(key, jsonStringify(tokens));
    }

    getTokens(): TokenModel[] {
        const key = this.getKey();
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: TokenModel[] = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value, key])
                return [];
            }
        }
        return [];
    }

    private getKey(): string {
        return `${this.identifierService.getPrincipal()}-tokens`;
    }
}