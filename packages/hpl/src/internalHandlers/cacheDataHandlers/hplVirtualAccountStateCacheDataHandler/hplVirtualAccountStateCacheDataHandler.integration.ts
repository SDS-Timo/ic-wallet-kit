import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplVirtualAccountStateCacheDataInfo } from "@hpl/forms/virtualAccounts/hplVirtualAccountStateCacheDataInfo";
import { HplVirtualAccountStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplVirtualAccountStateCacheDataHandler/hplVirtualAccountStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { CanisterService } from "@hpl/service";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types";
import { FormResult, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplVirtualAccountStateCacheDataHandler tests", () => {
    const testData = [
        /*  {
              name: "get accounts state from canister",
              input: {
                  virtualAccountId: BigInt(0),
                  force: true
              } as HplVirtualAccountStateCacheDataInfo,
              data: {
                  cacheData: undefined,
                  service: {
                      accountId: BigInt(0),
                      accountState: {
                          ft: BigInt(0),
                      },
                      time: BigInt(0),
                      virtualAccountId: BigInt(0)
                  }
              },
              result: FormResult.success(
                  {
                      accountId: BigInt(0),
                      accountState: {
                          ft: BigInt(0),
                      },
                      time: BigInt(0),
                      virtualAccountId: BigInt(0)
                  } as HplStateVirtualAccountsCacheModel)
          },*/
        {
            name: "get accounts state from cache",
            input: {
                virtualAccountId: BigInt(0),
                loadType: LoadType.Cache
            } as HplVirtualAccountStateCacheDataInfo,
            data: {
                service: undefined,
                cacheData: [{
                    accountId: BigInt(44),
                    accountState: {
                        ft: BigInt(44),
                    },
                    time: BigInt(44),
                    virtualAccountId: BigInt(44),
                }] as HplStateVirtualAccountsCacheModel[],
            },
            result: FormResult.success({
                accountId: BigInt(44),
                accountState: {
                    ft: BigInt(44),
                },
                time: BigInt(44),
                virtualAccountId: BigInt(44),
            } as HplStateVirtualAccountsCacheModel)
        },
        /*{
            name: "get accounts state from cache, cache is empty",
            input: {
                virtualAccountId: BigInt(0),
                force: false
            } as HplVirtualAccountStateCacheDataInfo,
            data: {
                cacheData: undefined,
                service: {
                    accountId: BigInt(0),
                    accountState: {
                        ft: BigInt(0),
                    },
                    time: BigInt(0),
                    virtualAccountId: BigInt(0),
                }
            },
            result: FormResult.success(
                {
                    accountId: BigInt(0),
                    accountState: {
                        ft: BigInt(0),
                    },
                    time: BigInt(0),
                    virtualAccountId: BigInt(0),
                } as HplStateVirtualAccountsCacheModel)
        }*/
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("a");

            const canisterService = new CanisterService("rqx66-eyaaa-aaaap-aaona-cai", "lpwlq-2iaaa-aaaap-ab2vq-cai", "n65ik-oqaaa-aaaag-acb4q-cai")
            const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
            cacheRepository.getHplVirtualAccountState = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplVirtualAccountState = jest.fn().mockImplementation(() => { });

            const logger = new MockLogger();
            const hplVirtualAccountsStateCacheDataHandler = new HplVirtualAccountStateCacheDataHandler(logger, identifierService, cacheRepository, canisterService);

            hplVirtualAccountsStateCacheDataHandler.getExternalData = jest.fn().mockReturnValue(test.data.service);

            const result = await hplVirtualAccountsStateCacheDataHandler.handle(test.input);

            expect(result).toEqual(test.result);
        }, 10000);
    }

})