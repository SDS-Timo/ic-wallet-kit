import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { SupportedAssetsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/supportedAssetsCacheHandler/supportedAssetsCacheHandler";
import { ServiceLocalCache } from "@icrc/repositories/cache/serviceLocalCache/serviceLocalCache";
import { LocalCacheServiceAssetModel, LocalCacheServiceModel } from "@icrc/types/services";

describe("Unit SupportedAssetsCacheHandler tests", () => {
    const testData = [
        {
            name: "get supported Assets from canister",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                loadType: LoadType.Full
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                principals: [
                    "xevnm-gaaaa-aaaar-qafnq-cai",
                    "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    "mxzaz-hqaaa-aaaar-qaada-cai",
                    "ss2fx-dyaaa-aaaar-qacoq-cai",
                ]
            })
        },
        {
            name: "get supported Assets from cache",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: {
                    servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                    assets: [
                        {
                            ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                            deposit: BigInt(0),
                            assetDetail: {}
                        },
                    ] as LocalCacheServiceAssetModel[]
                } as LocalCacheServiceModel,
            },
            result: FormResult.success({
                principals: [
                    "ryjl3-tyaaa-aaaaa-aaaba-cai",
                ]
            })
        },
        {
            name: "get supported Assets from cache, cache is empty",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                principals: [
                    "xevnm-gaaaa-aaaar-qafnq-cai",
                    "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    "mxzaz-hqaaa-aaaar-qaada-cai",
                    "ss2fx-dyaaa-aaaar-qacoq-cai",
                ]
            })
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const cacheRepository = new (<new () => ServiceLocalCache><unknown>ServiceLocalCache)() as jest.Mocked<ServiceLocalCache>;
            cacheRepository.getService = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setService = jest.fn().mockReturnValue(undefined);
            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))
            const logger = new MockLogger();
            const hplAccountCacheDataHandler = new SupportedAssetsCacheHandler(logger, identifierService, cacheRepository);
            const result = await hplAccountCacheDataHandler.handle(test.input);
            expect(result).toEqual(test.result);


        }, 10000);
    }

})