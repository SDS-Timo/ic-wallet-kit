import { Principal } from "@dfinity/principal";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplRemoteCacheDataInfo, HplRemotesCacheDataResult } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplRemotesCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplRemotesCacheDataHandler/hplRemotesCacheDataHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { HplDataCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-kit/common";

describe("Unit HplRemotesCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplRemotesCacheDataHandler = new HplRemotesCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplRemotesCacheDataResult = {
        remotes: [
            {
                accountId: 1n,
                remoteId: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                remoteInfo: {
                    ft: 1n
                }
            }
        ]
    };

    it("HplRemotesCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplRemotesCacheDataHandler.validate({} as HplRemoteCacheDataInfo)
        const result = await hplRemotesCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });

    it("HplRemotesCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(data);

        const result = await hplRemotesCacheDataHandler.getLocalCacheData({} as HplRemoteCacheDataInfo);

        expect(result).toEqual(data);

    });
    it("HplRemotesCacheDataHandler getLocalCacheData undefined", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(undefined);

        const result = await hplRemotesCacheDataHandler.getLocalCacheData({} as HplRemoteCacheDataInfo);

        expect(result).toEqual(undefined);

    });

    it("HplRemotesCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.remoteAccountInfo = jest.fn().mockReturnValue([[
            [Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"), 1n],
            { ft: 1n }]]);

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplRemotesCacheDataHandler.getExternalData({} as HplRemoteCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplRemotesCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.remoteAccountInfo = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplRemotesCacheDataHandler.getExternalData({} as HplRemoteCacheDataInfo);

        expect(result).toEqual({
            remotes: []
        });

    });

    it("HplRemotesCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();
        let result: HplDataCacheModel = {} as HplDataCacheModel;

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(null);
        cacheRepository.setHplData = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplRemotesCacheDataHandler.updateField({} as HplRemoteCacheDataInfo, data);

        expect(result?.remotes).toEqual(data.remotes);

    });


    it("HplRemotesCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "remotes.unavailable",
            "Remotes unavailable"
        );

        const result = hplRemotesCacheDataHandler.getCacheDataError({} as HplRemoteCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplRemotesCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplRemotesCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})