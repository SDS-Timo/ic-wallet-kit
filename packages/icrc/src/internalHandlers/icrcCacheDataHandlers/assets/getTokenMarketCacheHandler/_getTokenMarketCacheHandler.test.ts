import { Actor } from "@dfinity/agent";
import { LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import {
    IcrcCacheTransactionFeeErrorKey,
    IcrcCacheTransactionFeeErrorMessage,
} from "@icrc/errors/cacheErrorMessages";
import { GetTokenMarketCacheHandler, GetTokenMarketCacheInfo } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { TokenMarketLocalCache } from "@icrc/repositories/cache/tokenMarketLocalCache/tokenMarketLocalCache";
import {
    AssetManagerConfiguration,
    TokenMarketInfo,
} from "@icrc/types";

describe("GetTokenMarketCacheHandler Tests", () => {
    const validInfo: GetTokenMarketCacheInfo = { loadType: LoadType.Cache };
    const validMarketData: TokenMarketInfo[] = [
        { name: "Token A", symbol: "TKA", price: 100 },
        { name: "Token B", symbol: "TKB", price: 200 },
    ];

    let logger: MockLogger;
    let identifierService: ReturnType<typeof mockAnonymousIdentifierService>;
    let tokenMarketCacheRepository: jest.Mocked<TokenMarketLocalCache>;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        tokenMarketCacheRepository = new (<new () => TokenMarketLocalCache>(
            <unknown>TokenMarketLocalCache
        ))() as jest.Mocked<TokenMarketLocalCache>;

        jest.clearAllMocks();
    });

    describe("getCacheDataError", () => {
        it("should return the correct CacheDataError object", () => {
            const configuration: AssetManagerConfiguration = {
                tokenMarketCanister: "mock-canister-id",
            } as AssetManagerConfiguration;
            const handler = new GetTokenMarketCacheHandler(
                logger,
                configuration,
                identifierService,
                tokenMarketCacheRepository
            );

            const error = handler.getCacheDataError(validInfo);

            expect(error.errorType).toBe(IcrcCacheTransactionFeeErrorKey);
            expect(error.message).toBe(IcrcCacheTransactionFeeErrorMessage);
        });
    });

    describe("validate", () => {
        it("should return correct result", async () => {
            const configuration: AssetManagerConfiguration = {
                tokenMarketCanister: "mock-canister-id",
            } as AssetManagerConfiguration;
            const handler = new GetTokenMarketCacheHandler(
                logger,
                configuration,
                identifierService,
                tokenMarketCacheRepository
            );

            await handler.validate(validInfo);
        });
    });

    describe("getLoadForceType", () => {
        it("should return the correct load force type", () => {
            const configuration: AssetManagerConfiguration = {
                tokenMarketCanister: "mock-canister-id",
            } as AssetManagerConfiguration;
            const handler = new GetTokenMarketCacheHandler(
                logger,
                configuration,
                identifierService,
                tokenMarketCacheRepository
            );

            const forceTypes = handler.getLoadForceType();
            expect(forceTypes).toEqual([LoadType.Full]);
        });
    });

    describe("getExternalData", () => {
        it("should fetch data from the market canister and map to TokenMarketInfo", async () => {
            const mockMarketActor = {
                get_latest_wallet_tokens: jest.fn().mockResolvedValue({
                    latest: [
                        {
                            config: { name: "Token A", symbol: "TKA" },
                            rates: [{ to_token: BigInt(0), rate: 100 }],
                        },
                        {
                            config: { name: "Token B", symbol: "TKB" },
                            rates: [{ to_token: BigInt(0), rate: 200 }],
                        },
                    ],
                }),
            };

            Actor.createActor = jest.fn().mockReturnValue(mockMarketActor);

            const configuration: AssetManagerConfiguration = {
                tokenMarketCanister: "mock-canister-id",
            } as AssetManagerConfiguration;
            const handler = new GetTokenMarketCacheHandler(
                logger,
                configuration,
                identifierService,
                tokenMarketCacheRepository
            );

            const result = await handler.getExternalData(validInfo);

            expect(result).toEqual({
                markets: validMarketData,
            });
            expect(mockMarketActor.get_latest_wallet_tokens).toHaveBeenCalled();
        });

        it("should fetch data from the market tokenMarketCanister undefined and map to TokenMarketInfo", async () => {
            const mockMarketActor = {
                get_latest_wallet_tokens: jest.fn().mockResolvedValue({
                    latest: [
                        {
                            config: { name: "Token A", symbol: "TKA" },
                            rates: [{ to_token: BigInt(0), rate: 100 }],
                        },
                        {
                            config: { name: "Token B", symbol: "TKB" },
                            rates: [{ to_token: BigInt(0), rate: 200 }],
                        },
                    ],
                }),
            };

            Actor.createActor = jest.fn().mockReturnValue(mockMarketActor);

            const configuration: AssetManagerConfiguration = {
                tokenMarketCanister: undefined
            } as AssetManagerConfiguration;
            const handler = new GetTokenMarketCacheHandler(
                logger,
                configuration,
                identifierService,
                tokenMarketCacheRepository
            );

            const result = await handler.getExternalData(validInfo);

            expect(result).toEqual({
                markets: validMarketData,
            });
            expect(mockMarketActor.get_latest_wallet_tokens).toHaveBeenCalled();
        });
    });

    describe("updateField", () => {
        it("should update the token market data in the local cache", () => {
            const configuration: AssetManagerConfiguration = {
                tokenMarketCanister: "mock-canister-id",
            } as AssetManagerConfiguration;
            const handler = new GetTokenMarketCacheHandler(
                logger,
                configuration,
                identifierService,
                tokenMarketCacheRepository
            );

            tokenMarketCacheRepository.setTokenMarkets = jest.fn();

            handler.updateField(validInfo, { markets: validMarketData });

            expect(
                tokenMarketCacheRepository.setTokenMarkets
            ).toHaveBeenCalledWith(validMarketData);
        });
    });

    describe("getLocalCacheData", () => {
        it("should return token market data from the local cache", async () => {
            tokenMarketCacheRepository.getTokenMarkets = jest
                .fn()
                .mockReturnValue(validMarketData);

            const configuration: AssetManagerConfiguration = {
                tokenMarketCanister: "mock-canister-id",
            } as AssetManagerConfiguration;
            const handler = new GetTokenMarketCacheHandler(
                logger,
                configuration,
                identifierService,
                tokenMarketCacheRepository
            );

            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toEqual({ markets: validMarketData });
        });

        it("should return undefined if local cache is empty", async () => {
            tokenMarketCacheRepository.getTokenMarkets = jest
                .fn()
                .mockReturnValue(undefined);

            const configuration: AssetManagerConfiguration = {
                tokenMarketCanister: "mock-canister-id",
            } as AssetManagerConfiguration;
            const handler = new GetTokenMarketCacheHandler(
                logger,
                configuration,
                identifierService,
                tokenMarketCacheRepository
            );

            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toBeUndefined();
        });
    });
});
