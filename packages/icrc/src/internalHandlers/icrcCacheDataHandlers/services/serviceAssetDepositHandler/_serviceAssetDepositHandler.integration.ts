import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceLocalCache } from "@icrc/repositories/cache/serviceLocalCache/serviceLocalCache";

describe("Unit ServiceAssetDepositHandler tests", () => {
    const testData = [
        {
            name: "get AssetDeposit from canister",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Full
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                serviceAssetDeposit: BigInt(0),
            })
        },
        {
            name: "get AssetDeposit from cache",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    deposit: BigInt(0),
                    assetDetail: {}
                },
            },
            result: FormResult.success({
                serviceAssetDeposit: BigInt(0),
            })
        },
        {
            name: "get AssetDeposit from cache, cache is empty",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                serviceAssetDeposit: BigInt(0),
            })
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const cacheRepository = new (<new () => ServiceLocalCache><unknown>ServiceLocalCache)() as jest.Mocked<ServiceLocalCache>;
            cacheRepository.getServiceAsset = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setServiceAsset = jest.fn().mockReturnValue(undefined);
            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))
            const logger = new MockLogger();
            const hplAccountCacheDataHandler = new ServiceAssetDepositHandler(logger, identifierService, cacheRepository);
            const result = await hplAccountCacheDataHandler.handle(test.input);
            expect(result).toEqual(test.result);


        }, 10000);
    }

})