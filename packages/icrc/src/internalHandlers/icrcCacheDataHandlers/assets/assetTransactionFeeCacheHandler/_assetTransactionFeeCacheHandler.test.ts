import { LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import {
    IcrcCacheTransactionFeeErrorKey,
    IcrcCacheTransactionFeeErrorMessage,
} from "@icrc/errors/cacheErrorMessages";
import { AssetTransactionFeeCacheHandler, AssetTransactionFeeInfo, AssetTransactionFeeResult } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetTransactionFeeCacheHandler/assetTransactionFeeCacheHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";


describe("AssetTransactionFeeCacheHandler Tests", () => {
    const validInfo: AssetTransactionFeeInfo = {
        ledgerAddress: "mock-ledger-address",
        loadType: LoadType.Quick,
    };

    const validResult: AssetTransactionFeeResult = {
        transactionFee: BigInt(100),
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
            const handler = new AssetTransactionFeeCacheHandler(logger, identifierService, localCacheRepository);
            const error = handler.getCacheDataError(validInfo);

            expect(error.errorType).toBe(IcrcCacheTransactionFeeErrorKey);
            expect(error.message).toBe(IcrcCacheTransactionFeeErrorMessage);
        });
    });

    describe("getLoadForceType", () => {
        it("should return the correct load force type", () => {
            const handler = new AssetTransactionFeeCacheHandler(logger, identifierService, localCacheRepository);
            const forceTypes = handler.getLoadForceType();

            expect(forceTypes).toEqual([LoadType.Full]);
        });
    });

    describe("getExternalData", () => {
        it("should fetch transaction fee from the ledger", async () => {
            const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
            LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);
            ledgerWrapper.getTransactionFee = jest.fn().mockResolvedValue(validResult.transactionFee);

            const handler = new AssetTransactionFeeCacheHandler(logger, identifierService, localCacheRepository);
            const result = await handler.getExternalData(validInfo);

            expect(LedgerWrapper.create).toHaveBeenCalledWith(identifierService.getAgent(), validInfo.ledgerAddress);
            expect(ledgerWrapper.getTransactionFee).toHaveBeenCalled();
            expect(result).toEqual(validResult);
        });
    });

    describe("updateField", () => {
        it("should update the transaction fee in the local cache for a new asset", () => {
            localCacheRepository.getAssetById = jest.fn().mockReturnValue(undefined);
            localCacheRepository.setAsset = jest.fn();

            const handler = new AssetTransactionFeeCacheHandler(logger, identifierService, localCacheRepository);
            handler.updateField(validInfo, validResult);

            expect(localCacheRepository.setAsset).toHaveBeenCalledWith({
                ledgerAddress: validInfo.ledgerAddress,
                subAccounts: [],
                transactionFee: validResult.transactionFee,
            });
        });

        it("should update the transaction fee in the local cache for an existing asset", () => {
            const existingAsset = {
                ledgerAddress: validInfo.ledgerAddress,
                subAccounts: [],
                transactionFee: BigInt(50),
            };

            localCacheRepository.getAssetById = jest.fn().mockReturnValue(existingAsset);
            localCacheRepository.setAsset = jest.fn();

            const handler = new AssetTransactionFeeCacheHandler(logger, identifierService, localCacheRepository);
            handler.updateField(validInfo, validResult);

            expect(localCacheRepository.setAsset).toHaveBeenCalledWith({
                ...existingAsset,
                transactionFee: validResult.transactionFee,
            });
        });
    });

    describe("getLocalCacheData", () => {
        it("should return transaction fee from the local cache", async () => {
            const asset = {
                ledgerAddress: validInfo.ledgerAddress,
                transactionFee: validResult.transactionFee,
            };

            localCacheRepository.getAssetById = jest.fn().mockReturnValue(asset);

            const handler = new AssetTransactionFeeCacheHandler(logger, identifierService, localCacheRepository);
            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toEqual(validResult);
        });

        it("should return undefined if transaction fee is not found in the local cache", async () => {
            localCacheRepository.getAssetById = jest.fn().mockReturnValue(undefined);

            const handler = new AssetTransactionFeeCacheHandler(logger, identifierService, localCacheRepository);
            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toBeUndefined();
        });
    });
});
