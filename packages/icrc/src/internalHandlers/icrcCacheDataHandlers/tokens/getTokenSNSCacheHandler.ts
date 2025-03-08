import { BaseCacheDataHandler, CacheDataError, IdentifierService, IInfo, ILogger, LoadType } from "@ic-wallet-middleware/common";
import { TokenLocalCache } from "@icrc/repositories";
import { IcrcLedgerServiceWrapper } from "@icrc/wrappers";

import { CkERC20Wrapper } from "@icrc/wrappers/ckERC20/ckERC20Wrapper";
import { ManualTokenWrapper } from "@icrc/wrappers/default/manualTokenWrapper";
import { SnsWrapper } from "@icrc/wrappers/SNSs/snsWrapper";
import { TokenApiResult } from "@icrc/wrappers/tokenApiResult";
import { TokenModel } from "@icrc/wrappers/tokenModel";
import { Inject, Service } from "typedi";

export interface GetTokenInfo extends IInfo {

}

export interface GetTokenResult {
    TokenList: TokenModel[];
}

@Service()
export class GetTokenSNSCacheHandler extends BaseCacheDataHandler<GetTokenInfo, GetTokenResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private tokenCacheRepository: TokenLocalCache,
        private identifierService: IdentifierService,
        private snsWrapper: SnsWrapper,
        private ckERC20Wrapper: CkERC20Wrapper,
        private manualTokenWrapper: ManualTokenWrapper
    ) {
        super(logger);
    }

    validate(form: GetTokenInfo): Promise<void> {
        return Promise.resolve();
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

    async getLocalCacheData(info: GetTokenInfo): Promise<GetTokenResult | undefined> {
        const tokens = await this.tokenCacheRepository.getTokens();
        if (tokens.length > 0) {
            return {
                TokenList: tokens
            }
        }
        else {
            return undefined;
        }
    }

    async getExternalData(info: GetTokenInfo): Promise<GetTokenResult> {
        const snsTokens = await this.snsWrapper.getSNSTokens();
        const ckERC20Tokens = await this.ckERC20Wrapper.getCkERC20Tokens();
        const manualTokens = await this.manualTokenWrapper.getTokens();
        const tokens = [...snsTokens, ...ckERC20Tokens, ...manualTokens];

        const tokenApiList: TokenApiResult[] = [];

        for (const tkn of tokens) {

            const index = tokenApiList.findIndex(t => tkn.symbol == t.symbol);

            if (index < 0) {
                tokenApiList.push(tkn);
            }
            else {
                tokenApiList[index] = tkn;
            }
        }

        const tokenList: TokenModel[] = [];

        for (const tkn of tokenApiList) {

            const params = {
                agent: this.identifierService.getAgent(),
                ledgerAddress: tkn.ledgerAddress
            };

            const icrcLedgerServiceWrapper = IcrcLedgerServiceWrapper.create(params, this.logger);

            const standards = await icrcLedgerServiceWrapper.getICRCSupportedStandards();

            tokenList.push({ ...tkn, supportedStandard: standards });
        }

        return {
            TokenList: tokenList
        }
    }

    async updateField(info: GetTokenInfo, data: GetTokenResult): Promise<void> {
        await this.tokenCacheRepository.setTokens(data.TokenList);
    }

    getCacheDataError(info: GetTokenInfo): CacheDataError {
        return new CacheDataError(
            "tokens.unavailable",
            "Token unavailable"
        );
    }

}
