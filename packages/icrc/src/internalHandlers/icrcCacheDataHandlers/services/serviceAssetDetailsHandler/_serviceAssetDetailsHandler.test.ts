import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcCacheBalanceErrorKey, IcrcCacheBalanceErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { ServiceAssetDetailsHandler, ServiceAssetDetailsInfo, ServiceAssetDetailsResult } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { ServiceLocalCache } from "@icrc/repositories";

import { Icrc84ActorWrapper } from "@icrc/wrappers";

describe("ServiceAssetDetailsHandler Tests", () => {
    const validInfo: ServiceAssetDetailsInfo = {
        servicePrincipal: "mock-service-principal",
        ledgerAddress: "mock-ledger-address",
        loadType: LoadType.Quick,
    };

    const validResult: ServiceAssetDetailsResult = {
        assetDetail: {
            allowanceFee: BigInt(10),
            depositFee: BigInt(20),
            withdrawalFee: BigInt(30),
        },
    };

    let logger: MockLogger;
    let identifierService: ReturnType<typeof mockAnonymousIdentifierService>;
    let serviceCacheRepository: jest.Mocked<ServiceLocalCache>;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        serviceCacheRepository = new (<new () => ServiceLocalCache><unknown>ServiceLocalCache)() as jest.Mocked<ServiceLocalCache>;
        jest.clearAllMocks();
    });

    it("ServiceAssetDetailsHandler:getCacheDataError - should return the correct CacheDataError object", () => {
        const handler = new ServiceAssetDetailsHandler(logger, identifierService, serviceCacheRepository);
        const error = handler.getCacheDataError(validInfo);

        expect(error.errorType).toBe(IcrcCacheBalanceErrorKey);
        expect(error.message).toBe(IcrcCacheBalanceErrorMessage);
    });

    it("ServiceAssetDetailsHandler:getLoadForceType - should return the correct load force types", async () => {
        const handler = new ServiceAssetDetailsHandler(logger, identifierService, serviceCacheRepository);
        const forceTypes = handler.getLoadForceType();

        await handler.validate(validInfo);
        expect(forceTypes).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("ServiceAssetDetailsHandler:getExternalData - should fetch asset details from the external source", async () => {
        const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
        Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);
        icrc84ActorWrapper.getAssetInfo = jest.fn().mockResolvedValue({
            allowance_fee: BigInt(10),
            deposit_fee: BigInt(20),
            withdrawal_fee: BigInt(30),
        });

        const handler = new ServiceAssetDetailsHandler(logger, identifierService, serviceCacheRepository);
        const result = await handler.getExternalData(validInfo);

        expect(Icrc84ActorWrapper.create).toHaveBeenCalledWith(
            identifierService.getAgent(),
            validInfo.servicePrincipal
        );
        expect(icrc84ActorWrapper.getAssetInfo).toHaveBeenCalledWith(validInfo.ledgerAddress);
        expect(result).toEqual(validResult);
    });

    it("ServiceAssetDetailsHandler:getExternalData - should throw CacheDataError if the external call fails", async () => {
        const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
        Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);
        icrc84ActorWrapper.getAssetInfo = jest.fn().mockRejectedValue(new Error("External call failed"));

        const handler = new ServiceAssetDetailsHandler(logger, identifierService, serviceCacheRepository);

        await expect(handler.getExternalData(validInfo)).rejects.toThrow(CacheDataError);
    });

    it("ServiceAssetDetailsHandler:updateField - should update the service asset details in the local cache", () => {
        serviceCacheRepository.getServiceAsset = jest.fn().mockReturnValue(undefined);
        serviceCacheRepository.setServiceAsset = jest.fn();

        const handler = new ServiceAssetDetailsHandler(logger, identifierService, serviceCacheRepository);
        handler.updateField(validInfo, validResult);

        expect(serviceCacheRepository.setServiceAsset).toHaveBeenCalledWith(validInfo.servicePrincipal, {
            ledgerAddress: validInfo.ledgerAddress,
            deposit: BigInt(0),
            assetDetail: validResult.assetDetail,
        });
    });

    it("ServiceAssetDetailsHandler:updateField - should update existing service asset details in the local cache", () => {
        const existingAsset = {
            ledgerAddress: validInfo.ledgerAddress,
            deposit: BigInt(50),
            assetDetail: {
                allowanceFee: BigInt(5),
                depositFee: BigInt(10),
                withdrawalFee: BigInt(15),
            },
        };

        serviceCacheRepository.getServiceAsset = jest.fn().mockReturnValue(existingAsset);
        serviceCacheRepository.setServiceAsset = jest.fn();

        const handler = new ServiceAssetDetailsHandler(logger, identifierService, serviceCacheRepository);
        handler.updateField(validInfo, validResult);

        expect(serviceCacheRepository.setServiceAsset).toHaveBeenCalledWith(validInfo.servicePrincipal, {
            ...existingAsset,
            assetDetail: validResult.assetDetail,
        });
    });

    it("ServiceAssetDetailsHandler:getLocalCacheData - should return asset details from the local cache", async () => {
        const cachedData = {
            ledgerAddress: validInfo.ledgerAddress,
            assetDetail: validResult.assetDetail,
        };

        serviceCacheRepository.getServiceAsset = jest.fn().mockReturnValue(cachedData);

        const handler = new ServiceAssetDetailsHandler(logger, identifierService, serviceCacheRepository);
        const result = await handler.getLocalCacheData(validInfo);

        expect(result).toEqual(validResult);
    });

    it("ServiceAssetDetailsHandler:getLocalCacheData - should return undefined if asset details are not found in the local cache", async () => {
        serviceCacheRepository.getServiceAsset = jest.fn().mockReturnValue(undefined);

        const handler = new ServiceAssetDetailsHandler(logger, identifierService, serviceCacheRepository);
        const result = await handler.getLocalCacheData(validInfo);

        expect(result).toBeUndefined();
    });
});
