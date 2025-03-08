import { LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcCacheBalanceErrorKey, IcrcCacheBalanceErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { ServiceAssetDepositHandler, ServiceAssetDepositInfo, ServiceAssetDepositResult } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceLocalCache } from "@icrc/repositories";
import { Icrc84ActorWrapper } from "@icrc/wrappers";

describe("ServiceAssetDepositHandler Tests", () => {
    const validInfo: ServiceAssetDepositInfo = {
        servicePrincipal: "mock-service-principal",
        ledgerAddress: "mock-ledger-address",
        loadType: LoadType.Quick,
    };

    const validResult: ServiceAssetDepositResult = {
        serviceAssetDeposit: BigInt(1000),
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

    describe("ServiceAssetDepositHandler: getCacheDataError", () => {
        it("ServiceAssetDepositHandler: should return the correct CacheDataError object", () => {
            const handler = new ServiceAssetDepositHandler(logger, identifierService, serviceCacheRepository);
            const error = handler.getCacheDataError(validInfo);

            expect(error.errorType).toBe(IcrcCacheBalanceErrorKey);
            expect(error.message).toBe(IcrcCacheBalanceErrorMessage);
        });
    });

    describe("ServiceAssetDepositHandler: getLoadForceType", () => {
        it("ServiceAssetDepositHandler: should return the correct load force types", async () => {
            const handler = new ServiceAssetDepositHandler(logger, identifierService, serviceCacheRepository);

            await handler.validate(validInfo);

            const forceTypes = handler.getLoadForceType();

            expect(forceTypes).toEqual([LoadType.Full, LoadType.Quick]);
        });
    });

    describe("ServiceAssetDepositHandler: getExternalData", () => {
        it("ServiceAssetDepositHandler: should fetch deposit data from the external source", async () => {
            const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
            Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);
            icrc84ActorWrapper.trackedDeposit = jest.fn().mockResolvedValue(validResult.serviceAssetDeposit);

            const handler = new ServiceAssetDepositHandler(logger, identifierService, serviceCacheRepository);
            const result = await handler.getExternalData(validInfo);

            expect(Icrc84ActorWrapper.create).toHaveBeenCalledWith(identifierService.getAgent(), validInfo.servicePrincipal);
            expect(icrc84ActorWrapper.trackedDeposit).toHaveBeenCalledWith(validInfo.ledgerAddress);
            expect(result).toEqual(validResult);
        });

        it("ServiceAssetDepositHandler: should handle errors during external call and log the error", async () => {
            const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
            Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);
            icrc84ActorWrapper.trackedDeposit = jest.fn().mockRejectedValue(new Error("External call failed"));

            logger.logError = jest.fn();

            const handler = new ServiceAssetDepositHandler(logger, identifierService, serviceCacheRepository);
            const result = await handler.getExternalData(validInfo);

            expect(logger.logError).toHaveBeenCalled();
            expect(result).toEqual({ serviceAssetDeposit: BigInt(0) });
        });
    });

    describe("ServiceAssetDepositHandler: updateField", () => {
        it("ServiceAssetDepositHandler: should update the service asset deposit in the local cache", () => {
            serviceCacheRepository.getServiceAsset = jest.fn().mockReturnValue(undefined);
            serviceCacheRepository.setServiceAsset = jest.fn();

            const handler = new ServiceAssetDepositHandler(logger, identifierService, serviceCacheRepository);
            handler.updateField(validInfo, validResult);

            expect(serviceCacheRepository.setServiceAsset).toHaveBeenCalledWith(
                validInfo.servicePrincipal,
                {
                    ledgerAddress: validInfo.ledgerAddress,
                    deposit: validResult.serviceAssetDeposit,
                    assetDetail: undefined,
                }
            );
        });

        it("ServiceAssetDepositHandler: should update existing service asset deposit in the local cache", () => {
            const existingAsset = {
                ledgerAddress: validInfo.ledgerAddress,
                deposit: BigInt(500),
                assetDetail: undefined,
            };

            serviceCacheRepository.getServiceAsset = jest.fn().mockReturnValue(existingAsset);
            serviceCacheRepository.setServiceAsset = jest.fn();

            const handler = new ServiceAssetDepositHandler(logger, identifierService, serviceCacheRepository);
            handler.updateField(validInfo, validResult);

            expect(serviceCacheRepository.setServiceAsset).toHaveBeenCalledWith(
                validInfo.servicePrincipal,
                {
                    ...existingAsset,
                    deposit: validResult.serviceAssetDeposit,
                }
            );
        });
    });

    describe("getLocalCacheData", () => {
        it("should return deposit data from the local cache", async () => {
            const cachedData = {
                ledgerAddress: validInfo.ledgerAddress,
                deposit: validResult.serviceAssetDeposit,
            };

            serviceCacheRepository.getServiceAsset = jest.fn().mockReturnValue(cachedData);

            const handler = new ServiceAssetDepositHandler(logger, identifierService, serviceCacheRepository);
            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toEqual(validResult);
        });

        it("should return undefined if deposit data is not found in the local cache", async () => {
            serviceCacheRepository.getServiceAsset = jest.fn().mockReturnValue(undefined);

            const handler = new ServiceAssetDepositHandler(logger, identifierService, serviceCacheRepository);
            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toBeUndefined();
        });
    });
});
