import { ILogger, IStorage } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockStorage } from "@icrc/__tests_utils/mockStorage";
import { TokenMarketLocalCache } from "@icrc/repositories/cache/tokenMarketLocalCache/tokenMarketLocalCache";
import { TokenMarketInfo } from "@icrc/types/assets";

describe("TokenMarketLocalCache", () => {
    let logger: ILogger;
    let storage: IStorage;
    let tokenMarketLocalCache: TokenMarketLocalCache;

    beforeEach(() => {
        logger = new MockLogger();
        storage = mockStorage();
        tokenMarketLocalCache = new TokenMarketLocalCache(logger, storage);
    });

    it("TokenMarketLocalCache:setTokenMarkets should store token markets in local storage", () => {
        const tokens: TokenMarketInfo[] = [
            { name: "Token A", symbol: "TKA", price: 100 },
            { name: "Token B", symbol: "TKB", price: 200 }
        ];

        tokenMarketLocalCache.setTokenMarkets(tokens);
        expect(storage.setItem).toHaveBeenCalledWith("tokenMarkets", JSON.stringify(tokens));
    });

    it("TokenMarketLocalCache:getTokenMarkets should return token markets from local storage", () => {
        const tokens: TokenMarketInfo[] = [
            { name: "Token A", symbol: "TKA", price: 100 }
        ];
        storage.getItem = jest.fn().mockReturnValue(JSON.stringify(tokens));

        const result = tokenMarketLocalCache.getTokenMarkets();
        expect(result).toEqual(tokens);
    });

    it("TokenMarketLocalCache:getTokenMarkets should return empty array on invalid JSON", () => {
        storage.getItem = jest.fn().mockReturnValue({});
        logger.logError = jest.fn();
        const result = tokenMarketLocalCache.getTokenMarkets();

        expect(logger.logError).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it("TokenMarketLocalCache:getTokenMarkets should return undefined if no data is stored", () => {
        storage.getItem = jest.fn().mockReturnValue(undefined);
        const result = tokenMarketLocalCache.getTokenMarkets();

        expect(result).toBeUndefined();
    });
});
