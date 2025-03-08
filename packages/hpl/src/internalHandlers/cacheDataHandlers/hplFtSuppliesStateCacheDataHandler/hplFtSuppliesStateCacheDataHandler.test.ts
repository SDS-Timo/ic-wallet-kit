import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplFtSuppliesStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplFtSuppliesStateCacheDataHandler/hplFtSuppliesStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplFtSuppliesCacheModel, HplStateAccountsCacheModel, HplStateCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplFtSuppliesStateCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplFtSuppliesStateCacheDataHandler = new HplFtSuppliesStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplFtSuppliesCacheModel[] = [{
        assetId: BigInt(1),
        ftSupply: BigInt(2)
    }];


    it("HplFtSuppliesStateCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplFtSuppliesStateCacheDataHandler.validate({} as HplStateCacheDataInfo)
        const result = await hplFtSuppliesStateCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("HplFtSuppliesStateCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplFtSuppliesState = jest.fn().mockReturnValue(data);

        const result = await hplFtSuppliesStateCacheDataHandler.getLocalCacheData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplFtSuppliesStateCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getState = jest.fn().mockReturnValue(Promise.resolve(
            {
                ftSupplies: [{
                    assetId: BigInt(1),
                    ftSupply: BigInt(2)
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

        const result = await hplFtSuppliesStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplFtSuppliesStateCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getState = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplFtSuppliesStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual([]);

    });

    it("HplFtSuppliesStateCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: HplStateAccountsCacheModel[] = [] as HplStateAccountsCacheModel[];

        cacheRepository.getHplFtSuppliesState = jest.fn().mockReturnValue(null);
        cacheRepository.setHplFtSuppliesState = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplFtSuppliesStateCacheDataHandler.updateField({} as HplStateCacheDataInfo, data);

        expect(result).toEqual(data);

    });


    it("HplFtSuppliesStateCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );

        const result = hplFtSuppliesStateCacheDataHandler.getCacheDataError({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplFtSuppliesStateCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplFtSuppliesStateCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})