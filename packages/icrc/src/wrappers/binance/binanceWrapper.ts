import { ILogger } from "@ic-wallet-kit/common";
import { AssetManagerConfiguration, TokenMarketInfo } from "@icrc/types";
import { Inject, Service } from "typedi";

interface BinanceToken {
    symbol: string;
    price: string;
}

const defaultBaseBinanceUrl = "https://api.binance.com/api/v3/ticker/price?symbol=";

@Service()
export class BinanceWrapper {


    constructor(
        @Inject("ILogger")
        private logger: ILogger,
        @Inject("AssetManagerConfiguration")
        private configuration: AssetManagerConfiguration,
    ) {

    }

    public async getBinanceTokens(): Promise<TokenMarketInfo[]> {
        let tokens: TokenMarketInfo[] = [];

        const [btcResult, icpResult, ethResult] = await Promise.all([
            this.fetchToken("BTCUSDT"),
            this.fetchToken("ICPUSDT"),
            this.fetchToken("ETHUSDT"),

        ]);

        if (btcResult) {
            tokens.push(this.createTokenInfo("ckBTC", "ckBTC", btcResult.price));
        }

        if (icpResult) {
            tokens.push(this.createTokenInfo("Internet Computer", "ICP", icpResult.price));
        }

        if (ethResult) {
            tokens.push(this.createTokenInfo("ckETH", "ckETH", ethResult.price));
        }

        return tokens;
    }

    private createTokenInfo( name: string, symbol: string,  price: string): TokenMarketInfo
    {
        return {
            name: name,
            symbol: symbol,
            price: Number.parseFloat(price)
        };
    }

    private async fetchToken(symbol: string): Promise<BinanceToken | undefined> {

        let result: BinanceToken | undefined = undefined;

        console.log(this.configuration);

        const baseUrl = this.configuration?.baseBinanceUrl ?? defaultBaseBinanceUrl;

        try {
            const response = await fetch(`${baseUrl}${symbol}`);
            if (response.ok && response.status === 200) {
                result = await response.json();
            }

        } catch (error) {
            this.logger.logError(error, "Get binance token error.");
        }

        return result;
    }

}
