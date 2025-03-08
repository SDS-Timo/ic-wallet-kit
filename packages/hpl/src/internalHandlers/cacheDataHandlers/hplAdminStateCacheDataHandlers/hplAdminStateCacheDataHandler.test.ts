import { Principal } from "@dfinity/principal";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers/ingressActorWrapper/ingressActorWrapper";
import { HplAdminStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplAdminStateCacheDataHandlers/hplAdminStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplStateCacheModel } from "@hpl/types/cache";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";

describe("Unit hplAdminStateCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplAdminStateCacheDataHandler = new HplAdminStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    it("hplAdminStateCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplAdminStateCacheDataHandler.validate({} as HplStateCacheDataInfo)
        const result = await hplAdminStateCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });

    it("hplAdminStateCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        const data = {
            ftSupplies: [{ ftSupplies: "ftSupplies" }],
            virtualAccounts: [{ virtualAccounts: "virtualAccounts" }],
            accounts: [{ accounts: "accounts" }],
            remoteAccounts: [{ remoteAccounts: "remoteAccounts" }],
        }

        cacheRepository.getHplAdminState = jest.fn().mockReturnValue(data);

        const result = await hplAdminStateCacheDataHandler.getLocalCacheData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    }, 10000);

    it("hplAdminStateCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        const data: HplStateCacheModel = {
            ftSupplies: [{ assetId: BigInt(11), ftSupply: BigInt(22) }],
            virtualAccounts: [{
                virtualAccountId: BigInt(44),
                accountState: { ft: BigInt(55) },
                accountId: BigInt(66),
                time: BigInt(77),
            }],
            accounts: [{ accountId: BigInt(88), accountState: { ft: BigInt(99) } }],
            remoteAccounts: [{ accountState: { ft: BigInt(111) }, remoteAccountId: BigInt(222), time: BigInt(333), remotePrincipal: Principal.anonymous().toString() }],
        }

        ingressActorWrapper.getAdminState = jest.fn().mockReturnValue(data);

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplAdminStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    }, 10000);

    it("hplAdminStateCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

        ingressActorWrapper.getAdminState = jest.fn().mockRejectedValue("Test Error");

        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        const result = await hplAdminStateCacheDataHandler.getExternalData({} as HplStateCacheDataInfo);

        expect(result).toEqual({
            accounts: [],
            ftSupplies: [],
            virtualAccounts: [],
            remoteAccounts: []
        });

    });

    it("hplAdminStateCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        const data: HplStateCacheModel = {
            ftSupplies: [{ assetId: BigInt(11), ftSupply: BigInt(22) }],
            virtualAccounts: [{
                virtualAccountId: BigInt(44),
                accountState: { ft: BigInt(55) },
                accountId: BigInt(66),
                time: BigInt(77),
            }],
            accounts: [{ accountId: BigInt(88), accountState: { ft: BigInt(99) } }],
            remoteAccounts: [{ accountState: { ft: BigInt(111) }, remoteAccountId: BigInt(222), time: BigInt(333), remotePrincipal: Principal.anonymous().toString() }],
        }

        let result = undefined;

        cacheRepository.getHplAdminState = jest.fn().mockReturnValue(null);
        cacheRepository.setHplAdminState = jest.fn().mockImplementation((canisterId, hplState) => { result = hplState; })

        await hplAdminStateCacheDataHandler.updateField({} as HplStateCacheDataInfo, data);

        expect(result).toEqual(data);

    }, 10000);


    it("hplAdminStateCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );

        const result = hplAdminStateCacheDataHandler.getCacheDataError({} as HplStateCacheDataInfo);

        expect(result).toEqual(data);

    }, 10000);


    it("hplAdminStateCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplAdminStateCacheDataHandler.processError({});

        expect(result).toEqual([]);

    }, 10000);

})