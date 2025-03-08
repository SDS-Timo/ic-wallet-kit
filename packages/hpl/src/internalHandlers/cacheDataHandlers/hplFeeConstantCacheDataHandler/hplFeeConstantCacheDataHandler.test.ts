import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplFeeConstantCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplFeeConstantCacheDataHandler/hplFeeConstantCacheDataHandler";
import { HplFeeConstantCacheRepository } from "@hpl/repositories";
import { CacheDataError, LoadType } from "@ic-wallet-kit/common";

describe("Unit HplFeeConstantCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplFeeConstantCacheRepository><unknown>HplFeeConstantCacheRepository)() as jest.Mocked<HplFeeConstantCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplFeeConstantCacheDataHandler = new HplFeeConstantCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data = 1n;


    it("HplFeeConstantCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplFeeConstantCacheDataHandler.validate({} as HplCacheDataInfo)
        const result = await hplFeeConstantCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });

    it("HplFeeConstantCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getFeeConstantByCanisterId = jest.fn().mockReturnValue(data);

        const result = await hplFeeConstantCacheDataHandler.getLocalCacheData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplFeeConstantCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.feeRatio = jest.fn().mockReturnValue(Promise.resolve(data));

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplFeeConstantCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplFeeConstantCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.feeRatio = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplFeeConstantCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual(BigInt(0));

    });

    it("HplFeeConstantCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: bigint = BigInt(0);

        cacheRepository.getFeeConstantByCanisterId = jest.fn().mockReturnValue(null);
        cacheRepository.setFeeConstant = jest.fn().mockImplementation((canisterId, feeConstant) => { result = feeConstant; })

        await hplFeeConstantCacheDataHandler.updateField({} as HplCacheDataInfo, data);

        expect(result).toEqual(data);

    });


    it("HplFeeConstantCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "fee.constant.unavailable",
            "Fee Constant unavailable"
        );

        const result = hplFeeConstantCacheDataHandler.getCacheDataError({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplFeeConstantCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplFeeConstantCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})