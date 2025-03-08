import { IdentifierService, ILogger, IStorage, jsonStringify } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockStorage } from "@icrc/__tests_utils/mockStorage";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { ServiceLocalCache } from "@icrc/repositories/cache/serviceLocalCache/serviceLocalCache";
import { LocalCacheServiceAssetModel } from "@icrc/types";

describe("ServiceLocalCache", () => {
    let logger: ILogger;
    let identifierService: IdentifierService;
    let storage: IStorage;
    let serviceLocalCache: ServiceLocalCache;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        storage = mockStorage();
        serviceLocalCache = new ServiceLocalCache(logger, identifierService, storage);
    });

    it("ServiceLocalCache:getService should retrieve a service from storage", () => {
        const serviceId = "service-123";
        const mockService = { servicePrincipal: serviceId, assets: [] };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(mockService));

        const result = serviceLocalCache.getService(serviceId);
        expect(result).toEqual(mockService);
        expect(storage.getItem).toHaveBeenCalledWith(expect.stringContaining(serviceId));
    });

    it("ServiceLocalCache:setService should store a service in storage", () => {
        const mockService = { servicePrincipal: "service-123", assets: [] };
        serviceLocalCache.setService(mockService);

        expect(storage.setItem).toHaveBeenCalledWith(
            expect.stringContaining(mockService.servicePrincipal),
            jsonStringify(mockService)
        );
    });

    it("ServiceLocalCache:getServiceAsset should retrieve a service asset", () => {
        const serviceId = "service-123";
        const ledgerAddress = "ledger-xyz";
        const mockService = {
            servicePrincipal: serviceId,
            assets: [{ ledgerAddress, deposit: BigInt(1000) }]
        };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(mockService));

        const result = serviceLocalCache.getServiceAsset(serviceId, ledgerAddress);
        expect(result).toEqual(mockService.assets[0]);
    });

    it("ServiceLocalCache:getServiceAsset should retrieve a service und", () => {
        const serviceId = "service-123";
        const ledgerAddress = "ledger-xyz";

        storage.getItem = jest.fn().mockReturnValue(jsonStringify(undefined));

        const result = serviceLocalCache.getServiceAsset(serviceId, ledgerAddress);
        expect(result).toEqual(undefined);
    });

    it("ServiceLocalCache:setServiceAsset should update or add a service asset", () => {
        const serviceId = "service-123";
        const asset: LocalCacheServiceAssetModel = {
            ledgerAddress: "ledger-xyz",
            deposit: BigInt(1000),
            assetDetail: undefined
        };

        const mockService = { servicePrincipal: serviceId, assets: [] };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(mockService));

        serviceLocalCache.setServiceAsset(serviceId, asset);

        expect(storage.setItem).toHaveBeenCalled();
    });

    it("ServiceLocalCache:setServiceAsset should update or add a service asset", () => {
        const serviceId = "service-123";
        const asset: LocalCacheServiceAssetModel = {
            ledgerAddress: "ledger-xyz",
            deposit: BigInt(1000),
            assetDetail: undefined
        };

        const mockService = { servicePrincipal: serviceId, assets: [{ ...asset, deposit: BigInt(111) }] };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(mockService));

        serviceLocalCache.setServiceAsset(serviceId, asset);

        expect(storage.setItem).toHaveBeenCalledWith(serviceLocalCache["getKey"](serviceId),
            jsonStringify({ servicePrincipal: serviceId, assets: [asset] }));
    });

    it("ServiceLocalCache:getAllCredits should retrieve credits from storage", () => {
        const serviceId = "service-123";
        const mockCredits = [{ ledgerAddress: "ledger-xyz", credit: BigInt(500) }];
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(mockCredits));

        const result = serviceLocalCache.getAllCredits(serviceId);
        expect(result).toEqual(mockCredits);
    });

    it("ServiceLocalCache:getAllCredits should retrieve credits from storage", () => {
        const serviceId = "service-123";
        const mockCredits = [{ ledgerAddress: "ledger-xyz", credit: BigInt(500) }];
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(mockCredits));

        const result = serviceLocalCache.getAllCredits(serviceId);
        expect(result).toEqual(mockCredits);
    });

    it("ServiceLocalCache:getAllCredits should retrieve credits from storage", () => {
        const serviceId = "service-123";
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(undefined));
        const result = serviceLocalCache.getAllCredits(serviceId);
        expect(result).toEqual(undefined);
    });

    it("ServiceLocalCache:getAllCredits should retrieve credits from storage", () => {
        const serviceId = "service-123";
        storage.getItem = jest.fn().mockReturnValue({});

        logger.logError = jest.fn();

        serviceLocalCache.getAllCredits(serviceId);

        expect(logger.logError).toHaveBeenCalled();

    });

    it("ServiceLocalCache:setCredits should store credits in storage", () => {
        const serviceId = "service-123";
        const mockCredits = [{ ledgerAddress: "ledger-xyz", credit: BigInt(500) }];

        serviceLocalCache.setCredits(serviceId, mockCredits);

        expect(storage.setItem).toHaveBeenCalledWith(
            expect.stringContaining(serviceId),
            jsonStringify(mockCredits)
        );
    });

    it("ServiceLocalCache:getServiceInternal should with error", () => {
        const serviceId = "service-123";

        storage.getItem = jest.fn().mockReturnValue({});

        logger.logError = jest.fn();

        serviceLocalCache["getServiceInternal"](serviceId);

        expect(logger.logError).toHaveBeenCalled();

    });
});
