import { HttpAgent } from "@dfinity/agent";
import { IdentifierService, LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { GetTokenMarketCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { TokenMarketLocalCache } from "@icrc/repositories/cache/tokenMarketLocalCache/tokenMarketLocalCache";


describe("Unit getTokenMarketCacheHandler tests", () => {
    const testData =
        [
            {
                name: "getTokenMarketCacheHandler no cache",
                input: {
                    cacheResult: undefined,
                    loadType: LoadType.Cache
                },
                result: {
                    items: 1
                }
            },
            {
                name: "getTokenMarketCacheHandler cache presents",
                input: {
                    cacheResult: [],
                    loadType: LoadType.Cache
                },
                result: {
                    items: 0
                }
            }
        ];

    for (let test of testData) {
        it(test.name, async () => {
            const tokenMarketCacheRepository = new (<new () => TokenMarketLocalCache><unknown>TokenMarketLocalCache)() as jest.Mocked<TokenMarketLocalCache>;

            tokenMarketCacheRepository.getTokenMarkets = jest.fn().mockReturnValue(test.input.cacheResult);

            tokenMarketCacheRepository.setTokenMarkets = jest.fn().mockReturnValue({});

            const logger = new MockLogger();

            const assetManagerConfiguration = {
                defaultDateTimeFormat: "MM/DD/YYYY HH:mm",

            };

            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;

            identifierService.getAgent = jest.fn().mockReturnValue(HttpAgent.createSync())

            const getTokenMarketCacheHandler = new GetTokenMarketCacheHandler(logger, assetManagerConfiguration, identifierService, tokenMarketCacheRepository);

            const result = await getTokenMarketCacheHandler.handle({ loadType: test.input.loadType });

            expect(result.data?.markets.length).toBeGreaterThanOrEqual(test.result.items);

        });
    }
});