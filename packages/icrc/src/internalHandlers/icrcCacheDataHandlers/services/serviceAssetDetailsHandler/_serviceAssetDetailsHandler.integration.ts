import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { ServiceAssetDetailsHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { ServiceLocalCache } from "@icrc/repositories/cache/serviceLocalCache/serviceLocalCache";

describe("Unit ServiceAssetDetailsHandler tests", () => {
    const testData = [
        {
            name: "get AssetDetails from canister",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Full
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                assetDetail: {
                    allowanceFee: BigInt(10000),
                    withdrawalFee: BigInt(10000),
                    depositFee: BigInt(10000),
                }
            })
        },
        {
            name: "get AssetDetails from cache",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    deposit: BigInt(0),
                    assetDetail: {
                        allowanceFee: BigInt(0),
                        withdrawalFee: BigInt(0),
                        depositFee: BigInt(0),
                    }
                },
            },
            result: FormResult.success({
                assetDetail: {
                    allowanceFee: BigInt(0),
                    withdrawalFee: BigInt(0),
                    depositFee: BigInt(0),
                }
            })
        },
        {
            name: "get AssetDetails from cache, cache is empty",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                assetDetail: {
                    allowanceFee: BigInt(10000),
                    withdrawalFee: BigInt(10000),
                    depositFee: BigInt(10000),
                }
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
            const serviceAssetDepositHandler = new ServiceAssetDetailsHandler(logger, identifierService, cacheRepository);
            const result = await serviceAssetDepositHandler.handle(test.input);
            expect(result).toEqual(test.result);


        }, 10000);
    }

})