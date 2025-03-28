
import { Actor } from "@dfinity/agent";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, IInfo, ILogger, LoadType } from "@ic-wallet-kit/common";
import { idlFactory as MarketIDLFactory } from "@icrc/candid/neutrinite/candid.did";
import { LatestExtendedToken, _SERVICE as MarketActor } from "@icrc/candid/neutrinite/service.did";
import { IcrcCacheTransactionFeeErrorKey, IcrcCacheTransactionFeeErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { TokenMarketLocalCache } from "@icrc/repositories/cache/tokenMarketLocalCache/tokenMarketLocalCache";
import { AssetManagerConfiguration, TokenMarketInfo } from "@icrc/types";
import { BinanceWrapper } from "@icrc/wrappers/binance/binanceWrapper";
import { Inject, Service } from "typedi";

const marketCanister = "u45jl-liaaa-aaaam-abppa-cai";

export interface GetTokenMarketCacheInfo extends IInfo {
}

export interface GetTokenMarketCacheResult {
    markets: TokenMarketInfo[];
}

@Service()
export class GetTokenMarketCacheHandler extends BaseCacheDataHandler<GetTokenMarketCacheInfo, GetTokenMarketCacheResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetManagerConfiguration")
        private configuration: AssetManagerConfiguration,
        private identifierService: IdentifierService,
        private tokenMarketCacheRepository: TokenMarketLocalCache,
        private binanceWrapper: BinanceWrapper
    ) {
        super(logger);
    }

    public getCacheDataError(info: GetTokenMarketCacheInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheTransactionFeeErrorKey,
            IcrcCacheTransactionFeeErrorMessage
        );
    }

    public getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

    public validate(form: GetTokenMarketCacheInfo): Promise<void> {
        return Promise.resolve();
    }

    public async getExternalData(
        info: GetTokenMarketCacheInfo
    ): Promise<GetTokenMarketCacheResult> {
        let tokenMarkets: TokenMarketInfo[] = [];

        const marketActor = Actor.createActor<MarketActor>(MarketIDLFactory, {
            agent: this.identifierService.getAgent(),
            canisterId: this.configuration.tokenMarketCanister || marketCanister,
        });

        const res = await marketActor.get_latest_wallet_tokens();

        tokenMarkets = this.extendedTokenToMarketInfo(res.latest);

        const binanceTokens = await this.binanceWrapper.getBinanceTokens();

        for(let binance of binanceTokens)
        {
            const token = tokenMarkets.find(tm => binance.symbol == tm.symbol);
            if(token)
            {
                token.price = binance.price;
            }
            else
            {
                tokenMarkets.push(binance);
            }
        }

        return {
            markets: tokenMarkets
        };
    }

    private extendedTokenToMarketInfo(extendedTokens: LatestExtendedToken[]): TokenMarketInfo[] {
        return extendedTokens.map((token, k) => {
            let price = 0;
            for (let index = 0; index < token.rates.length; index++) {
                const rate = token.rates[index];
                if (rate.to_token === BigInt(0)) {
                    price = rate.rate;
                }
            }

            return {
                name: token.config.name,
                symbol: token.config.symbol,
                price: price,
            };
        });
    }

    public updateField(
        info: GetTokenMarketCacheInfo,
        data: GetTokenMarketCacheResult
    ): void {

        this.tokenMarketCacheRepository.setTokenMarkets(data.markets);
    }

    public getLocalCacheData(
        info: GetTokenMarketCacheInfo
    ): Promise<GetTokenMarketCacheResult | undefined> {

        const tokenMarkets = this.tokenMarketCacheRepository.getTokenMarkets();

        const result = tokenMarkets ? { markets: tokenMarkets } : undefined;

        return Promise.resolve(result);
    }
}
