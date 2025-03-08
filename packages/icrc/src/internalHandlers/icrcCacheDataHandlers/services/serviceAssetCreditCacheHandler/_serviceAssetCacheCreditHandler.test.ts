import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcCacheMetadataErrorKey, IcrcCacheMetadataErrorMessage } from "@icrc/errors";
import { ServiceAssetCacheCreditHandler, ServiceAssetCreditInfo } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { SupportedAssetsResult } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/supportedAssetsCacheHandler/supportedAssetsCacheHandler";
import { ServiceLocalCache } from "@icrc/repositories";
import { LocalCacheCreditModel } from "@icrc/types";
import { Icrc84ActorWrapper } from "@icrc/wrappers";

describe("Unit ServiceAssetCacheCreditHandler tests", () => {

    const cacheRepository = new (<new () => ServiceLocalCache><unknown>ServiceLocalCache)() as jest.Mocked<ServiceLocalCache>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const serviceAssetCacheCreditHandler = new ServiceAssetCacheCreditHandler(logger, identifierService, cacheRepository);

    const data: LocalCacheCreditModel = {
        ledgerAddress: "ledgerAddress",
        credit: 1n
    };


    const fakeInfo = { ledgerAddress: data.ledgerAddress } as ServiceAssetCreditInfo;

    it("ServiceAssetCacheCreditHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getAllCredits = jest.fn().mockReturnValue([data]);

        const result = await serviceAssetCacheCreditHandler.getLocalCacheData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("ServiceAssetCacheCreditHandler getLoadForceType", async () => {
        jest.restoreAllMocks();

        const result = serviceAssetCacheCreditHandler.getLoadForceType();
        await serviceAssetCacheCreditHandler.validate(fakeInfo);

        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("ServiceAssetCacheCreditHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;

        icrc84ActorWrapper.getCredit = jest.fn().mockReturnValue(Promise.resolve(data.credit));

        Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);

        const result = await serviceAssetCacheCreditHandler.getExternalData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("ServiceAssetCacheCreditHandler updateField", async () => {
        jest.restoreAllMocks();


        let result: SupportedAssetsResult = {} as SupportedAssetsResult;

        cacheRepository.getAllCredits = jest.fn().mockReturnValue(undefined);
        cacheRepository.setCredits = jest.fn().mockImplementation((serviceId, credits) => { result = credits; });

        await serviceAssetCacheCreditHandler.updateField(fakeInfo, data);

        expect(result).toEqual([data]);

    });

    it("ServiceAssetCacheCreditHandler updateField getAllCredits exists", async () => {
        jest.restoreAllMocks();


        let result: SupportedAssetsResult = {} as SupportedAssetsResult;

        cacheRepository.getAllCredits = jest.fn().mockReturnValue([data]);
        cacheRepository.setCredits = jest.fn().mockImplementation((serviceId, credits) => { result = credits; });

        await serviceAssetCacheCreditHandler.updateField(fakeInfo, data);

        expect(result).toEqual([data]);

    });


    it("ServiceAssetCacheCreditHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            IcrcCacheMetadataErrorKey,
            IcrcCacheMetadataErrorMessage
        );

        const result = serviceAssetCacheCreditHandler.getCacheDataError(fakeInfo);

        expect(result).toEqual(data);

    });

    it("SupportedAssetsCacheHandler processError", async () => {
        jest.restoreAllMocks();

        const result = serviceAssetCacheCreditHandler.processError({});

        expect(result).toEqual([]);

    });

})