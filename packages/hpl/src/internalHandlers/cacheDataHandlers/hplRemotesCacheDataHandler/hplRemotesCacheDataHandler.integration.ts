import { Principal } from "@dfinity/principal";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { phraseToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplRemotesCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplRemotesCacheDataHandler/hplRemotesCacheDataHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { FormResult, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplVirtualAccountsStateCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts state from canister",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Full
            },
            data: {
                cacheData: undefined,
                service: {
                    remotes: [{
                        accountId: BigInt(0),
                        remoteId: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                        remoteInfo: {
                            ft: BigInt(1)
                        }
                    }]
                }
            },
            result: FormResult.success({
                remotes: [{
                    accountId: BigInt(0),
                    remoteId: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                    remoteInfo: {
                        ft: BigInt(1)
                    }
                }]
            })
        },
        {
            name: "get accounts state from cache",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Cache
            },
            data: {
                cacheData: {
                    remotes: [
                        {
                            accountId: BigInt(0),
                            remoteId: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                            remoteInfo: {
                                ft: BigInt(0)
                            }
                        }
                    ]
                },
                service: undefined
            },
            result: FormResult.success({
                remotes: [{
                    accountId: BigInt(0),
                    remoteId: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                    remoteInfo: {
                        ft: BigInt(0)
                    }
                }]
            })
        },
        {
            name: "get accounts state from cache, cache is empty",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
                service: {
                    remotes: [{
                        accountId: BigInt(0),
                        remoteId: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                        remoteInfo: {
                            ft: BigInt(1),
                        }
                    }]
                }
            },
            result: FormResult.success({
                remotes: [{
                    accountId: BigInt(0),
                    remoteId: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                    remoteInfo: {
                        ft: BigInt(1),
                    }
                }]
            })
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = await phraseToIdentifierService("hair guilt comic still lesson helmet glare material avocado venue giggle essence");

            const hplDataCacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;

            hplDataCacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(test.data.cacheData);
            hplDataCacheRepository.setHplData = jest.fn().mockReturnValue(undefined);

            const logger = new MockLogger();
            const hplRemoteAccountsStateCacheDataHandler = new HplRemotesCacheDataHandler(logger, identifierService, hplDataCacheRepository, mockCanisterService);

            hplRemoteAccountsStateCacheDataHandler.getExternalData = jest.fn().mockReturnValue(test.data.service);

            const result = await hplRemoteAccountsStateCacheDataHandler.handle(test.input);

            expect(result).toEqual(test.result);
        }, 10000);
    }

})