import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplRemoteAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplRemoteAccountsStateCacheDataHandler/hplRemoteAccountsStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplStateAccountsCacheModel, HplStateCacheModel, HplStateRemoteAccountsCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplRemoteAccountsStateCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplRemoteAccountsStateCacheDataHandler = new HplRemoteAccountsStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplStateRemoteAccountsCacheModel[] = [{
        remoteAccountId: BigInt(11),
        remotePrincipal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
        time: 0n,
        accountState: {
            ft: BigInt(2)
        }

    }];


    it("HplRemoteAccountsStateCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplRemoteAccountsStateCacheDataHandler.validate({} as HplStateCacheDataInfo)
        const result = await hplRemoteAccountsStateCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("HplRemoteAccountsStateCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplRemoteAccountState = jest.fn().mockReturnValue(data);

        const result = await hplRemoteAccountsStateCacheDataHandler.getLocalCacheData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplRemoteAccountsStateCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getState = jest.fn().mockReturnValue(Promise.resolve(
            {
                ftSupplies: [],
                virtualAccounts: [],
                accounts: [],
                remoteAccounts: [{
                    accountState: {
                        ft: BigInt(2)
                    },
                    remoteAccountId: 11n,
                    remotePrincipal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                    time: 0n
                }]
            } as HplStateCacheModel
        ));

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplRemoteAccountsStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplRemoteAccountsStateCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getState = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplRemoteAccountsStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual([]);

    });

    it("HplRemoteAccountsStateCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: HplStateAccountsCacheModel[] = [] as HplStateAccountsCacheModel[];

        cacheRepository.getHplRemoteAccountState = jest.fn().mockReturnValue(data);
        cacheRepository.setHplRemoteAccountState = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplRemoteAccountsStateCacheDataHandler.updateField({} as HplStateCacheDataInfo, data);

        expect(result).toEqual(data);

    });

    it("HplRemoteAccountsStateCacheDataHandler updateField, empty cache", async () => {
        jest.restoreAllMocks();

        let result: HplStateAccountsCacheModel[] = [] as HplStateAccountsCacheModel[];

        cacheRepository.getHplRemoteAccountState = jest.fn().mockReturnValue(null);
        cacheRepository.setHplRemoteAccountState = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplRemoteAccountsStateCacheDataHandler.updateField({} as HplStateCacheDataInfo, data);

        expect(result).toEqual(data);

    });


    it("HplRemoteAccountsStateCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );

        const result = hplRemoteAccountsStateCacheDataHandler.getCacheDataError({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplRemoteAccountsStateCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplRemoteAccountsStateCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})