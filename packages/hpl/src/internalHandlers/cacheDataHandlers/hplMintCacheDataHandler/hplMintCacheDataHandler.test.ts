import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplMintCacheDataInfo } from "@hpl/forms";
import { HplMintActorWrapper } from "@hpl/hplWrappers";
import { HplMintCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplMintCacheDataHandler/hplMintCacheDataHandler";
import { HplMintCacheRepository } from "@hpl/repositories";
import { HplMintCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplMintCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplMintCacheRepository><unknown>HplMintCacheRepository)() as jest.Mocked<HplMintCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplMintCacheDataHandler = new HplMintCacheDataHandler(logger, identifierService, cacheRepository);

    const data: HplMintCacheModel = {
        canisterId: "mock-canisterId",
        isMinter: true
    };


    it("HplMintCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplMintCacheDataHandler.validate({} as HplMintCacheDataInfo)
        const result = await hplMintCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });

    it("HplMintCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplMintByCanisterId = jest.fn().mockReturnValue(data);

        const result = await hplMintCacheDataHandler.getLocalCacheData({} as HplMintCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplMintCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const hplMintActorWrapper = new (<new () => HplMintActorWrapper><unknown>HplMintActorWrapper)() as jest.Mocked<HplMintActorWrapper>;

        hplMintActorWrapper.isHplMinter = jest.fn().mockReturnValue(Promise.resolve(true));

        HplMintActorWrapper.create = jest.fn().mockReturnValue(hplMintActorWrapper);

        const result = await hplMintCacheDataHandler.getExternalData({ canisterId: "mock-canisterId" } as HplMintCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplMintCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const hplMintActorWrapper = new (<new () => HplMintActorWrapper><unknown>HplMintActorWrapper)() as jest.Mocked<HplMintActorWrapper>;

        hplMintActorWrapper.isHplMinter = jest.fn().mockRejectedValue("Test Error");

        HplMintActorWrapper.create = jest.fn().mockReturnValue(hplMintActorWrapper);

        const result = await hplMintCacheDataHandler.getExternalData({ canisterId: "mock-canisterId" } as HplMintCacheDataInfo);

        expect(result).toEqual({
            canisterId: data.canisterId,
            isMinter: false
        });

    });

    it("HplMintCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: HplMintCacheModel = {} as HplMintCacheModel;

        cacheRepository.getHplMintByCanisterId = jest.fn().mockReturnValue(null);
        cacheRepository.setHplMint = jest.fn().mockImplementation((hplMint) => { result = hplMint; })

        await hplMintCacheDataHandler.updateField({ canisterId: "mock-canisterId" } as HplMintCacheDataInfo, data);

        expect(result).toEqual(data);

    });


    it("HplMintCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "minter.unavailable",
            "Minter unavailable"
        );

        const result = hplMintCacheDataHandler.getCacheDataError({} as HplMintCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplMintCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplMintCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})