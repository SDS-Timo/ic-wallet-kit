import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplCacheDataInfo, HplFtAssetsCacheDataResult } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplFtAssetCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplFtAssetCacheDataHandler/hplFtAssetCacheDataHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { HplDataCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplFtAssetCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplFtAssetCacheDataHandler = new HplFtAssetCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplFtAssetsCacheDataResult = {
        ftAssetLastId: BigInt(1),
        ftAssets: [{
            assetId: BigInt(1),
            ftAssetInfo: {
                description: "mock-description",
                decimals: 2,
                controller: "mock-controller"
            }
        }]
    };

    it("HplFtAssetCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplFtAssetCacheDataHandler.validate({} as HplCacheDataInfo)
        const result = await hplFtAssetCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });

    it("HplFtAssetCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue({
            ftAssets: data
        });

        const result = await hplFtAssetCacheDataHandler.getLocalCacheData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });
    it("HplFtAssetCacheDataHandler getLocalCacheData undefined", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(undefined);

        const result = await hplFtAssetCacheDataHandler.getLocalCacheData({} as HplCacheDataInfo);

        expect(result).toEqual(undefined);

    });

    it("HplFtAssetCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getFtAssets = jest.fn().mockReturnValue(data.ftAssetLastId);

        ingressActorWrapper.getFtAssetInfo = jest.fn().mockReturnValue([{
            assetId: BigInt(1),
            description: "mock-description",
            decimals: 2,
            controller: "mock-controller"
        }]);

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplFtAssetCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplFtAssetCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getFtAssets = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplFtAssetCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual({
            ftAssetLastId: BigInt(0),
            ftAssets: []
        });

    });

    it("HplFtAssetCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();


        let result: HplDataCacheModel = {} as HplDataCacheModel;

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(null);
        cacheRepository.setHplData = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplFtAssetCacheDataHandler.updateField({} as HplCacheDataInfo, data);

        expect(result?.ftAssets).toEqual(data);

    });


    it("HplFtAssetCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "assets.unavailable",
            "Assets unavailable"
        );

        const result = hplFtAssetCacheDataHandler.getCacheDataError({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplFtAssetCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplFtAssetCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})