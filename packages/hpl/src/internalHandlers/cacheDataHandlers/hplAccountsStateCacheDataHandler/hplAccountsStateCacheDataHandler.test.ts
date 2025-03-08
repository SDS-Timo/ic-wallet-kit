import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplAccountsStateCacheDataHandler/hplAccountsStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplStateAccountsCacheModel, HplStateCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplAccountsStateCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplAccountsStateCacheDataHandler = new HplAccountsStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplStateAccountsCacheModel[] = [{
        accountId: BigInt(11),
        accountState: {
            ft: BigInt(2)
        }

    }];


    it("HplAccountsStateCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplAccountsStateCacheDataHandler.validate({} as HplStateCacheDataInfo)
        const result = await hplAccountsStateCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("HplAccountsStateCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplAccountState = jest.fn().mockReturnValue(data);

        const result = await hplAccountsStateCacheDataHandler.getLocalCacheData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplAccountsStateCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getState = jest.fn().mockReturnValue(Promise.resolve(
            {
                ftSupplies: [{
                    assetId: BigInt(0),
                    ftSupply: BigInt(0)
                }],
                virtualAccounts: [{
                    accountId: BigInt(11),
                    accountState: {
                        ft: BigInt(2)
                    },
                    virtualAccountId: BigInt(1),
                    time: BigInt(0)
                }],
                accounts: [{
                    accountId: BigInt(11),
                    accountState: {
                        ft: BigInt(2)
                    }
                }],
                remoteAccounts: []
            } as HplStateCacheModel
        ));

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplAccountsStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplAccountsStateCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getState = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplAccountsStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual([]);

    });

    it("HplAccountsStateCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: HplStateAccountsCacheModel[] = [] as HplStateAccountsCacheModel[];

        cacheRepository.getHplAccountState = jest.fn().mockReturnValue(null);
        cacheRepository.setHplAccountState = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplAccountsStateCacheDataHandler.updateField({} as HplStateCacheDataInfo, data);

        expect(result).toEqual(data);

    });


    it("HplAccountsStateCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );

        const result = hplAccountsStateCacheDataHandler.getCacheDataError({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplAccountsStateCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplAccountsStateCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})