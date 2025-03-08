import { Principal } from "@dfinity/principal";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplCacheDataInfo, HplVirtualAccountsCacheDataResult } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplVirtualAccountCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplVirtualAccountCacheDataHandler/hplVirtualAccountCacheDataHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { HplDataCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplVirtualAccountCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplVirtualAccountCacheDataHandler = new HplVirtualAccountCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    it("HplVirtualAccountCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplVirtualAccountCacheDataHandler.validate({} as HplCacheDataInfo)
        const result = await hplVirtualAccountCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });


    it("HplVirtualAccountCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        const data: HplVirtualAccountsCacheDataResult = {
            virtualAccountLastId: BigInt(11),
            virtualAccounts: [{
                virtualAccountId: BigInt(22),
                virtualAccountInfo: {
                    accountType: { ft: BigInt(33) },
                    principal: Principal.anonymous().toText()
                }
            }
            ]
        };

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue({
            virtualAccounts: data,
        });

        const result = await hplVirtualAccountCacheDataHandler.getLocalCacheData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    }, 10000);

    it("hplAdminStateCacheDataHandler getLocalCacheData undefined", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(undefined);

        const result = await hplVirtualAccountCacheDataHandler.getLocalCacheData({} as HplCacheDataInfo);

        expect(result).toEqual(undefined);

    });



    it("hplAdminStateCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        const data: HplVirtualAccountsCacheDataResult = {
            virtualAccountLastId: BigInt(11),
            virtualAccounts: [{
                virtualAccountId: BigInt(22),
                virtualAccountInfo: {
                    accountType: { ft: BigInt(33) },
                    principal: Principal.anonymous().toText()
                }
            }
            ]
        };

        ingressActorWrapper.getVirtualAccounts = jest.fn().mockReturnValue(data.virtualAccountLastId);

        ingressActorWrapper.getAllVirtualAccountInfo = jest.fn().mockReturnValue(data.virtualAccounts);

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplVirtualAccountCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    }, 10000);

    it("hplAdminStateCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getVirtualAccounts = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);
        const data = new CacheDataError(
            "virtualAccount.getVirtualAccounts.unavailable",
            "getVirtualAccounts canister method unavailable"
        );
        try {
            const result = await hplVirtualAccountCacheDataHandler.getExternalData({} as HplCacheDataInfo);

            expect(result).toEqual({});
        }
        catch (e: any) {
            expect(e.message).toEqual(data.message);
        }

    });


    it("hplAdminStateCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        const data: HplVirtualAccountsCacheDataResult = {
            virtualAccountLastId: BigInt(11),
            virtualAccounts: [{
                virtualAccountId: BigInt(22),
                virtualAccountInfo: {
                    accountType: { ft: BigInt(33) },
                    principal: Principal.anonymous().toText()
                }
            }
            ]
        };
        let result: HplDataCacheModel = {} as HplDataCacheModel;

        cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(null);
        cacheRepository.setHplData = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplVirtualAccountCacheDataHandler.updateField({} as HplCacheDataInfo, data);

        expect(result?.virtualAccounts).toEqual(data);

    }, 10000);


    it("hplAdminStateCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "virtualAccount.unavailable",
            "Virtual Account unavailable"
        );

        const result = hplVirtualAccountCacheDataHandler.getCacheDataError({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    }, 10000);


    it("hplAdminStateCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplVirtualAccountCacheDataHandler.processError({});

        expect(result).toEqual([]);

    }, 10000);

})