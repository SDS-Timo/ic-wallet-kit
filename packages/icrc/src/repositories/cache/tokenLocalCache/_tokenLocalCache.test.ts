import { IdentifierService, ILogger, IStorage } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockStorage } from "@icrc/__tests_utils/mockStorage";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { TokenLocalCache } from "@icrc/repositories/cache/tokenLocalCache/tokenLocalCache";
import { TokenModel } from "@icrc/wrappers/tokenModel";

describe("TokenLocalCache", () => {
    let logger: ILogger;
    let identifierService: IdentifierService;
    let storage: IStorage;
    let tokenLocalCache: TokenLocalCache;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        storage = mockStorage();
        tokenLocalCache = new TokenLocalCache(logger, identifierService, storage);
    });

    it("TokenLocalCache:setTokens should store tokens in storage", () => {
        const tokens: TokenModel[] = [
            {
                ledgerAddress: "mock-address-1",
                symbol: "TOKEN1",
                name: "Token One",
                decimal: 8,
                logo: "logo1",
                indexAddress: "mock-indexAddress",
                supportedStandard: []
            },
            {
                ledgerAddress: "mock-address-2",
                symbol: "TOKEN2",
                name: "Token Two",
                decimal: 6,
                logo: "logo2",
                indexAddress: "mock-indexAddress",
                supportedStandard: []
            },
        ];

        tokenLocalCache.setTokens(tokens);

        expect(storage.setItem).toHaveBeenCalledWith(
            `${identifierService.getPrincipal()}-tokens`,
            JSON.stringify(tokens)
        );
    });

    it("TokenLocalCache:getTokens should retrieve tokens from storage", () => {
        const tokens: TokenModel[] = [
            {
                ledgerAddress: "mock-address-1",
                symbol: "TOKEN1",
                name: "Token One",
                decimal: 8,
                logo: "logo1",
                indexAddress: "mock-indexAddress",
                supportedStandard: []
            }
        ];
        storage.getItem = jest.fn().mockReturnValue(JSON.stringify(tokens));

        const result = tokenLocalCache.getTokens();

        expect(result).toEqual(tokens);
        expect(storage.getItem).toHaveBeenCalledWith(`${identifierService.getPrincipal()}-tokens`);
    });

    it("TokenLocalCache:getTokens should return empty array if storage is empty", () => {
        storage.getItem = jest.fn().mockReturnValue(null);

        const result = tokenLocalCache.getTokens();

        expect(result).toEqual([]);
        expect(storage.getItem).toHaveBeenCalledWith(`${identifierService.getPrincipal()}-tokens`);
    });

    it("TokenLocalCache:getTokens should return empty array and log error if JSON is invalid", () => {
        storage.getItem = jest.fn().mockReturnValue("{sdf");

        logger.logError = jest.fn();

        const result = tokenLocalCache.getTokens();

        expect(result).toEqual([]);
        expect(logger.logError).toHaveBeenCalled();
    });

    it("TokenLocalCache:getKey should return the correct key", () => {
        const expectedKey = `${identifierService.getPrincipal()}-tokens`;
        const actualKey = tokenLocalCache["getKey"]();

        expect(actualKey).toBe(expectedKey);
    });
});
