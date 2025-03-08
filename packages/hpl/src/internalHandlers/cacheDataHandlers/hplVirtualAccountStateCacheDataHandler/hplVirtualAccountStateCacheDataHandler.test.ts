import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplVirtualAccountStateCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplVirtualAccountStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplVirtualAccountStateCacheDataHandler/hplVirtualAccountStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplVirtualAccountStateCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplVirtualAccountStateCacheDataHandler = new HplVirtualAccountStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplStateVirtualAccountsCacheModel[] = [
        {
            accountId: BigInt(22),
            accountState: { ft: BigInt(33) },
            time: BigInt(44),
            virtualAccountId: BigInt(55)
        },
        {
            accountId: BigInt(611),
            accountState: { ft: BigInt(622) },
            time: BigInt(633),
            virtualAccountId: BigInt(644)
        }
    ];
    const fakeInfo = {} as HplVirtualAccountStateCacheDataInfo;
    fakeInfo.virtualAccountId = data[0].virtualAccountId;

    it("HplVirtualAccountStateCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplVirtualAccountStateCacheDataHandler.validate(fakeInfo)
        const result = await hplVirtualAccountStateCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("HplVirtualAccountStateCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplVirtualAccountState = jest.fn().mockReturnValue(data);

        const result = await hplVirtualAccountStateCacheDataHandler.getLocalCacheData(fakeInfo);

        expect(result).toEqual(data[0]);

    });

    it("hplAdminStateCacheDataHandler getLocalCacheData undefined", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplVirtualAccountState = jest.fn().mockReturnValue(undefined);

        const result = await hplVirtualAccountStateCacheDataHandler.getLocalCacheData(fakeInfo);

        expect(result).toEqual(undefined);

    });

    it("HplVirtualAccountStateCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const getData = data[0];

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getVirtualAccountState = jest.fn().mockReturnValue(getData);

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplVirtualAccountStateCacheDataHandler.getExternalData(fakeInfo);

        expect(result).toEqual(getData);

    });


    it("HplVirtualAccountStateCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();


        let result: HplStateVirtualAccountsCacheModel = {} as HplStateVirtualAccountsCacheModel;

        cacheRepository.getHplVirtualAccountState = jest.fn().mockReturnValue([data[0]]);
        cacheRepository.setHplVirtualAccountState = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplVirtualAccountStateCacheDataHandler.updateField(fakeInfo, data[0]);

        expect(result).toEqual([data[0]]);
    });

    it("HplVirtualAccountStateCacheDataHandler updateField, empty cache", async () => {
        jest.restoreAllMocks();


        let result: HplStateVirtualAccountsCacheModel = {} as HplStateVirtualAccountsCacheModel;

        cacheRepository.getHplVirtualAccountState = jest.fn().mockReturnValue(null);
        cacheRepository.setHplVirtualAccountState = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplVirtualAccountStateCacheDataHandler.updateField(fakeInfo, data[0]);

        expect(result).toEqual([data[0]]);
    });

    it("HplVirtualAccountStateCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );

        const result = hplVirtualAccountStateCacheDataHandler.getCacheDataError(fakeInfo);

        expect(result).toEqual(data);

    });


    it("HplVirtualAccountStateCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplVirtualAccountStateCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})