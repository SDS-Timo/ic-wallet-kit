import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService, LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceLocalCache } from "@icrc/repositories/cache/serviceLocalCache/serviceLocalCache";

describe("Unit ServiceAssetCacheCreditHandler tests", () => {
    const testData = [
        {
            name: "get credit from canister, cache is empty",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Full
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                credit: BigInt(1)
            })
        },
        {
            name: "get credit from canister",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Full
            },
            data: {
                cacheData: [
                    {
                        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                        credit: BigInt(1)
                    },
                    {
                        ledgerAddress: "xevnm-gaaaa-aaaar-qafnq-cai",
                        credit: BigInt(0),
                    }
                ],
            },
            result: FormResult.success({
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                credit: BigInt(1)
            })
        },
        {
            name: "get credit from cache",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Full
            },
            data: {
                cacheData:
                    [
                        {
                            ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                            credit: BigInt(1)
                        },
                        {
                            ledgerAddress: "xevnm-gaaaa-aaaar-qafnq-cai",
                            credit: BigInt(0),
                        }
                    ]
            },
            result: FormResult.success({
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                credit: BigInt(1)
            })
        },
        {
            name: "get credit from cache, cache is empty",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                credit: BigInt(1)
            })
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const cacheRepository = new (<new () => ServiceLocalCache><unknown>ServiceLocalCache)() as jest.Mocked<ServiceLocalCache>;
            cacheRepository.getAllCredits = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setCredits = jest.fn().mockReturnValue(undefined);
            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))
            const logger = new MockLogger();
            const allCreditsHandler = new ServiceAssetCacheCreditHandler(logger, identifierService, cacheRepository);
            const result = await allCreditsHandler.handle(test.input);
            expect(result).toEqual(test.result);
        }, 10000);
    }

})