import { LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { GetTokenMarketCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { TokenMarketLocalCache } from "@icrc/repositories/cache/tokenMarketLocalCache/tokenMarketLocalCache";
import { BinanceWrapper } from "@icrc/wrappers/binance/binanceWrapper";


describe("Unit getTokenMarketCacheHandler tests", () => {
    const testData =
        [
            {
                name: "getTokenMarketCacheHandler no cache",
                input: {
                    loadType: LoadType.Full
                },
                result: {
                    items: 1
                }
            }
        ];

    for (let test of testData) {
        it(test.name, async () => {
            const tokenMarketCacheRepository = new (<new () => TokenMarketLocalCache><unknown>TokenMarketLocalCache)() as jest.Mocked<TokenMarketLocalCache>;

            const binanceWrapper = new (<new () => BinanceWrapper>(
                        <unknown>BinanceWrapper
                    ))() as jest.Mocked<BinanceWrapper>;

            const logger = new MockLogger();

            const assetManagerConfiguration = {
                defaultDateTimeFormat: "MM/DD/YYYY HH:mm",

            };

            tokenMarketCacheRepository.setTokenMarkets = jest.fn().mockReturnValue({});

            const identifierService =  mockAnonymousIdentifierService();

            const getTokenMarketCacheHandler = new GetTokenMarketCacheHandler(logger, assetManagerConfiguration, identifierService, tokenMarketCacheRepository, binanceWrapper);

            const result = await getTokenMarketCacheHandler.handle({ loadType: test.input.loadType });

         //   console.log(jsonStringify(result.data?.markets));

            expect(result.data?.markets.length).toBeGreaterThanOrEqual(test.result.items);

        });
    }
});