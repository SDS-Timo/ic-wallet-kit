import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplVirtualAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplVirtualAccountsStateCacheDataHandler/hplVirtualAccountsStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplStateAccountsCacheModel, HplStateCacheModel, HplStateVirtualAccountsCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-kit/common";

describe("Unit HplVirtualAccountsStateCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplVirtualAccountsStateCacheDataHandler = new HplVirtualAccountsStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplStateVirtualAccountsCacheModel[] = [{
        accountId: BigInt(11),
        accountState: {
            ft: BigInt(2)
        },
        time: 0n,
        virtualAccountId: 1n
    }];


    it("HplVirtualAccountsStateCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplVirtualAccountsStateCacheDataHandler.validate({} as HplStateCacheDataInfo)
        const result = await hplVirtualAccountsStateCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("HplVirtualAccountsStateCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplVirtualAccountState = jest.fn().mockReturnValue(data);

        const result = await hplVirtualAccountsStateCacheDataHandler.getLocalCacheData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplVirtualAccountsStateCacheDataHandler getExternalData", async () => {
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

        const result = await hplVirtualAccountsStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplVirtualAccountsStateCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getState = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplVirtualAccountsStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual([]);

    });

    it("HplVirtualAccountsStateCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: HplStateAccountsCacheModel[] = [] as HplStateAccountsCacheModel[];

        cacheRepository.getHplVirtualAccountState = jest.fn().mockReturnValue(null);
        cacheRepository.setHplVirtualAccountState = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplVirtualAccountsStateCacheDataHandler.updateField({} as HplStateCacheDataInfo, data);

        expect(result).toEqual(data);

    });


    it("HplVirtualAccountsStateCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );

        const result = hplVirtualAccountsStateCacheDataHandler.getCacheDataError({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplVirtualAccountsStateCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplVirtualAccountsStateCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})