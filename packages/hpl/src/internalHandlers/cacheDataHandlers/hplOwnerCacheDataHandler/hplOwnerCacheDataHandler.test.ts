import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplOwnerCacheDataInfo } from "@hpl/forms";
import { OwnersActorWrapper } from "@hpl/hplWrappers";
import { HplOwnerCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplOwnerCacheDataHandler/hplOwnerCacheDataHandler";
import { HplOwnerCacheRepository } from "@hpl/repositories";
import { HplOwnerDataCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-kit/common";

describe("Unit HplOwnerCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplOwnerCacheRepository><unknown>HplOwnerCacheRepository)() as jest.Mocked<HplOwnerCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplOwnerCacheDataHandler = new HplOwnerCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplOwnerDataCacheModel = {
        ownerId: 1n
    };


    it("HplOwnerCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplOwnerCacheDataHandler.validate({} as HplOwnerCacheDataInfo)
        const result = await hplOwnerCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });

    it("HplOwnerCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplOwnerByCanisterId = jest.fn().mockReturnValue(data);

        const result = await hplOwnerCacheDataHandler.getLocalCacheData({} as HplOwnerCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplOwnerCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ownersActorWrapper = new (<new () => OwnersActorWrapper><unknown>OwnersActorWrapper)() as jest.Mocked<OwnersActorWrapper>;

        ownersActorWrapper.lookup = jest.fn().mockReturnValue(Promise.resolve([1n]));

        OwnersActorWrapper.create = jest.fn().mockReturnValue(ownersActorWrapper);

        const result = await hplOwnerCacheDataHandler.getExternalData({} as HplOwnerCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplOwnerCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ownersActorWrapper = new (<new () => OwnersActorWrapper><unknown>OwnersActorWrapper)() as jest.Mocked<OwnersActorWrapper>;

        ownersActorWrapper.lookup = jest.fn().mockRejectedValue("Test Error");

        OwnersActorWrapper.create = jest.fn().mockReturnValue(ownersActorWrapper);

        const result = await hplOwnerCacheDataHandler.getExternalData({} as HplOwnerCacheDataInfo);

        expect(result).toEqual({
            ownerId: undefined
        });

    });

    it("HplOwnerCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: HplOwnerDataCacheModel = {} as HplOwnerDataCacheModel;

        cacheRepository.getHplOwnerByCanisterId = jest.fn().mockReturnValue(null);
        cacheRepository.setHplOwner = jest.fn().mockImplementation((canisterId, hplOwner) => { result = hplOwner; })

        await hplOwnerCacheDataHandler.updateField({} as HplOwnerCacheDataInfo, data);

        expect(result).toEqual(data);

    });


    it("HplOwnerCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "owner.unavailable",
            "Owner unavailable"
        );

        const result = hplOwnerCacheDataHandler.getCacheDataError({} as HplOwnerCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplOwnerCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplOwnerCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})