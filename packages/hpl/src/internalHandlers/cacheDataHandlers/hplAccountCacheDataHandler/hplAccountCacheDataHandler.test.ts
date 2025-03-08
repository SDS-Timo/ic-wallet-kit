import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplAccountsCacheDataResult, HplCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplAccountCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplAccountCacheDataHandler/hplAccountCacheDataHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { HplDataCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplAccountCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplAccountCacheDataHandler = new HplAccountCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplAccountsCacheDataResult = {
        accountLastId: BigInt(11),
        accounts: [{
            accountId: BigInt(22),
            accountType: { ft: BigInt(33) }
        }
        ]
    };

    it("HplAccountCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplAccountCacheDataHandler.validate({} as HplCacheDataInfo)
        const result = await hplAccountCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });

    it("HplAccountCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue({
            accounts: data
        });

        const result = await hplAccountCacheDataHandler.getLocalCacheData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplAccountCacheDataHandler getLocalCacheData, empty cache", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(undefined);

        const result = await hplAccountCacheDataHandler.getLocalCacheData({} as HplCacheDataInfo);

        expect(result).toEqual(undefined);

    });

    it("HplAccountCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getAccounts = jest.fn().mockReturnValue(data.accountLastId);

        ingressActorWrapper.getAllAccountsInfo = jest.fn().mockReturnValue(data.accounts);

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplAccountCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplAccountCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getAccounts = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplAccountCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual({ accountLastId: 0n, accounts: [] });

    });

    it("HplAccountCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();


        let result: HplDataCacheModel = {} as HplDataCacheModel;

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(null);
        cacheRepository.setHplData = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplAccountCacheDataHandler.updateField({} as HplCacheDataInfo, data);

        expect(result?.accounts).toEqual(data);

    });


    it("HplAccountCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "accounts.unavailable",
            "Accounts unavailable"
        );

        const result = hplAccountCacheDataHandler.getCacheDataError({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplAccountCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplAccountCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})