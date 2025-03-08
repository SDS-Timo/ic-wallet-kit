import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { HplAdminStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplAdminStateCacheDataHandlers/hplAdminStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { CanisterService } from "@hpl/service";
import { FormResult, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplFtSuppliesStateCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts state from canister",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [],
                loadType: LoadType.Full
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                accounts: [
                    {
                        accountId: BigInt(0),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(1),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(2),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(3),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(4),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(5),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(6),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(7),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(8),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(9),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(10),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(11),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(12),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(13),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(14),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(15),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(16),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(17),
                        accountState: {
                            ft: 346n,
                        },
                    },
                    {
                        accountId: BigInt(18),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(19),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(20),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(21),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(22),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(23),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(24),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(25),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(26),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(27),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(28),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(29),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(30),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(31),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(32),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(33),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(34),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(35),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(36),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(37),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(38),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(39),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                ],
                ftSupplies: [],
                remoteAccounts: [],
                virtualAccounts: [],
            })
        },
        {
            name: "get accounts state from cache",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(40),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: {
                    accounts: [
                        {
                            accountId: BigInt(0),
                            accountState: {
                                ft: BigInt(0),
                            },
                        }
                    ],
                    ftSupplies: [],
                    remoteAccounts: [],
                    virtualAccounts: [],
                },
            },
            result: FormResult.success({
                accounts: [
                    {
                        accountId: BigInt(0),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                ],
                ftSupplies: [],
                remoteAccounts: [],
                virtualAccounts: [],
            })
        },
        {
            name: "get accounts state from cache, cache is empty",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(40),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                accounts: [
                    {
                        accountId: BigInt(0),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(1),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(2),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(3),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(4),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(5),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(6),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(7),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(8),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(9),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(10),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(11),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(12),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(13),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(14),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(15),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(16),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(17),
                        accountState: {
                            ft: 346n,
                        },
                    },
                    {
                        accountId: BigInt(18),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(19),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(20),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(21),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(22),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(23),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(24),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(25),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(26),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(27),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(28),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(29),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(30),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(31),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(32),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(33),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(34),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(35),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(36),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(37),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(38),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(39),
                        accountState: {
                            ft: BigInt(0),
                        },
                    },
                ],
                ftSupplies: [],
                remoteAccounts: [],
                virtualAccounts: [],
            })
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("a");

            const canisterService = new CanisterService("rqx66-eyaaa-aaaap-aaona-cai", "lpwlq-2iaaa-aaaap-ab2vq-cai", "n65ik-oqaaa-aaaag-acb4q-cai")
            const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
            cacheRepository.getHplAdminState = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplAdminState = jest.fn().mockReturnValue(undefined);
            const logger = new MockLogger();
            const hplAdminStateCacheDataHandler = new HplAdminStateCacheDataHandler(logger, identifierService, cacheRepository, canisterService);
            const result = await hplAdminStateCacheDataHandler.handle(test.input);
            expect(result).toEqual(test.result);
        }, 10000);
    }

})