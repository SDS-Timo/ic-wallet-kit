import { LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcCacheMetadataErrorKey, IcrcCacheMetadataErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { AssetMetaDataCacheHandler, AssetMetaDataInfo, AssetMetaDataResult } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

describe("AssetMetaDataCacheHandler Tests", () => {
    const validInfo: AssetMetaDataInfo = {
        ledgerAddress: "mock-ledger-address",
        loadType: LoadType.Quick,
    };

    const validResult: AssetMetaDataResult = {
        symbol: "SYMB",
        name: "Mock Token",
        decimals: 8,
        logo: "mock-logo-url",
        fee: BigInt(100),
    };

    let logger: MockLogger;
    let identifierService: ReturnType<typeof mockAnonymousIdentifierService>;
    let localCacheRepository: jest.Mocked<AssetLocalCache>;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        localCacheRepository = new (<new () => AssetLocalCache><unknown>AssetLocalCache)() as jest.Mocked<AssetLocalCache>;
        jest.clearAllMocks();
    });

    describe("getCacheDataError", () => {
        it("should return the correct CacheDataError object", () => {
            const handler = new AssetMetaDataCacheHandler(logger, identifierService, localCacheRepository);
            const error = handler.getCacheDataError(validInfo);

            expect(error.errorType).toBe(IcrcCacheMetadataErrorKey);
            expect(error.message).toBe(IcrcCacheMetadataErrorMessage);
        });
    });

    describe("getLoadForceType", () => {
        it("should return the correct load force type", () => {
            const handler = new AssetMetaDataCacheHandler(logger, identifierService, localCacheRepository);
            const forceTypes = handler.getLoadForceType();

            expect(forceTypes).toEqual([LoadType.Full]);
        });
    });

    describe("getExternalData", () => {
        it("should fetch metadata from the ledger", async () => {
            const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
            LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);
            ledgerWrapper.getIcrcMetadataInfo = jest.fn().mockResolvedValue(validResult);

            const handler = new AssetMetaDataCacheHandler(logger, identifierService, localCacheRepository);
            const result = await handler.getExternalData(validInfo);

            expect(LedgerWrapper.create).toHaveBeenCalledWith(identifierService.getAgent(), validInfo.ledgerAddress);
            expect(ledgerWrapper.getIcrcMetadataInfo).toHaveBeenCalled();
            expect(result).toEqual(validResult);
        });
    });

    describe("updateField", () => {
        it("should update the asset metadata in the local cache", () => {
            localCacheRepository.getAssetById = jest.fn().mockReturnValue(undefined);
            localCacheRepository.setAsset = jest.fn();

            const handler = new AssetMetaDataCacheHandler(logger, identifierService, localCacheRepository);
            handler.updateField(validInfo, validResult);

            expect(localCacheRepository.setAsset).toHaveBeenCalledWith({
                ledgerAddress: validInfo.ledgerAddress,
                subAccounts: [],
                metaData: validResult,
            });
        });

        it("should update existing asset metadata in the local cache", () => {
            const existingAsset = {
                ledgerAddress: validInfo.ledgerAddress,
                subAccounts: [],
                metaData: {
                    symbol: "OLD",
                    name: "Old Token",
                    decimals: 6,
                    logo: "old-logo-url",
                    fee: BigInt(50),
                },
            };

            localCacheRepository.getAssetById = jest.fn().mockReturnValue(existingAsset);
            localCacheRepository.setAsset = jest.fn();

            const handler = new AssetMetaDataCacheHandler(logger, identifierService, localCacheRepository);
            handler.updateField(validInfo, validResult);

            expect(localCacheRepository.setAsset).toHaveBeenCalledWith({
                ...existingAsset,
                metaData: validResult,
            });
        });
    });

    describe("getLocalCacheData", () => {
        it("should return metadata from the local cache", async () => {
            const asset = {
                ledgerAddress: validInfo.ledgerAddress,
                metaData: validResult,
            };

            localCacheRepository.getAssetById = jest.fn().mockReturnValue(asset);

            const handler = new AssetMetaDataCacheHandler(logger, identifierService, localCacheRepository);
            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toEqual(validResult);
        });

        it("should return undefined if metadata is not found in the local cache", async () => {
            localCacheRepository.getAssetById = jest.fn().mockReturnValue(undefined);

            const handler = new AssetMetaDataCacheHandler(logger, identifierService, localCacheRepository);
            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toBeUndefined();
        });
    });
});
