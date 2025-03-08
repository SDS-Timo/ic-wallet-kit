import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { HplFtSuppliesStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplFtSuppliesStateCacheDataHandler/hplFtSuppliesStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplFtSuppliesCacheModel } from "@hpl/types";
import { FormResult, LoadType } from "@ic-wallet-kit/common";

describe("Unit HplFtSuppliesStateCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts state from canister",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(1),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [],
                loadType: LoadType.Full
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
                serviceData: [
                    {
                        assetId: BigInt(100),
                        ftSupply: BigInt(11015),
                    },
                    {
                        assetId: BigInt(122),
                        ftSupply: BigInt(21015),
                    }] as HplFtSuppliesCacheModel[]
            },
            result: FormResult.success([
                {
                    assetId: BigInt(100),
                    ftSupply: BigInt(11015),
                },
                {
                    assetId: BigInt(122),
                    ftSupply: BigInt(21015),
                }])
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
                cacheData: [
                    {
                        assetId: BigInt(0),
                        ftSupply: BigInt(21015),
                    },
                    {
                        assetId: BigInt(1),
                        ftSupply: BigInt(10000200000000),
                    }] as HplFtSuppliesCacheModel[]
            },
            result: FormResult.success([
                {
                    assetId: BigInt(0),
                    ftSupply: BigInt(21015),
                },
                {
                    assetId: BigInt(1),
                    ftSupply: BigInt(10000200000000),
                }] as HplFtSuppliesCacheModel[])
        },
        {
            name: "get accounts state from cache, cache is empty",
            input: {
                accountCount: BigInt(1),
                ftAssetCount: BigInt(1),
                virtualAccountCount: BigInt(1),
                remoteAccounts: [],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
                serviceData: [
                    {
                        assetId: BigInt(2100),
                        ftSupply: BigInt(211015),
                    },
                    {
                        assetId: BigInt(3122),
                        ftSupply: BigInt(321015),
                    }] as HplFtSuppliesCacheModel[]
            },
            result: FormResult.success([
                {
                    assetId: BigInt(2100),
                    ftSupply: BigInt(211015),
                },
                {
                    assetId: BigInt(3122),
                    ftSupply: BigInt(321015),
                }] as HplFtSuppliesCacheModel[])
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("testUser2345234");

            const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
            cacheRepository.getHplFtSuppliesState = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplFtSuppliesState = jest.fn().mockImplementation(() => { });


            const logger = new MockLogger();
            const hplFtSuppliesStateCacheDataHandler = new HplFtSuppliesStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

            hplFtSuppliesStateCacheDataHandler.getExternalData = jest.fn().mockReturnValue(test.data.serviceData);


            const result = await hplFtSuppliesStateCacheDataHandler.handle(test.input);



            expect(result).toEqual(test.result);
        }, 10000);
    }

})