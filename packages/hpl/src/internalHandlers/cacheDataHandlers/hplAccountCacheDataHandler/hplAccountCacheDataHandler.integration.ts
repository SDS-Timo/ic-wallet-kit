import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplAccountCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplAccountCacheDataHandler/hplAccountCacheDataHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { CanisterService } from "@hpl/service";
import { FormResult, LoadType } from "@ic-wallet-middleware/common";


describe("Unit HplAccountCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts from canister",
            input: {
                loadType: LoadType.Full
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                accountLastId: BigInt(5),
                accounts: [
                    {
                        accountId: BigInt(0),
                        accountType: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(1),
                        accountType: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(2),
                        accountType: {
                            ft: BigInt(5),
                        },
                    },
                    {
                        accountId: BigInt(3),
                        accountType: {
                            ft: BigInt(0),
                        },
                    },
                    {
                        accountId: BigInt(4),
                        accountType: {
                            ft: BigInt(17),
                        },
                    },
                ],
            })
        },

    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("a");

            const canisterService = new CanisterService("rqx66-eyaaa-aaaap-aaona-cai", "lpwlq-2iaaa-aaaap-ab2vq-cai", "n65ik-oqaaa-aaaag-acb4q-cai")
            const cacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
            cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplData = jest.fn().mockReturnValue(undefined);
            //identifierService.getAgent = jest.fn().mockReturnValue(identifierService.getAgent())
            //identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))
            const logger = new MockLogger();
            const hplAccountCacheDataHandler = new HplAccountCacheDataHandler(logger, identifierService, cacheRepository, canisterService);
            const result = await hplAccountCacheDataHandler.handle(test.input);
            expect(result).toEqual(test.result);


        }, 10000);
    }

})