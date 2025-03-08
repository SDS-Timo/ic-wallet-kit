import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplDictionaryCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplDictionaryCacheDataHandler/hplDictionaryCacheDataHandler";
import { HplDictionaryCacheRepository } from "@hpl/repositories";
import { HplDictionaryDataCacheModel } from "@hpl/types";
import { LoadType } from "@ic-wallet-middleware/common";

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
            result: [{
                assetId: 9n,
                creationTime: 1708803516699538823n,
                logo: "",
                modificationTime: 1708999855546228757n,
                name: "Wrapped toy token",
                symbol: "MYX.H"
            },
            {
                assetId: 12n,
                creationTime: 1708804657115229734n,
                logo: "",
                modificationTime: 1709000250392628622n,
                name: "Wrapped ckBTC",
                symbol: "ckBTC.H"
            },
            {
                assetId: 10n,
                creationTime: 1708804696491824815n,
                logo: "",
                modificationTime: 1709000260501657595n,
                name: "Wrapped ckETH",
                symbol: "ckETH.H"
            },
            {
                assetId: 11n,
                creationTime: 1708804726582723604n,
                logo: "",
                modificationTime: 1709000275024996100n,
                name: "Wrapped ICP",
                symbol: "ICP.H"
            },
            {
                assetId: 0n,
                creationTime: 1708914536288306446n,
                logo: "",
                modificationTime: 1708998770438006134n,
                name: "Native toy token",
                symbol: "ABC"
            }
            ]
        },
        {
            name: "get accounts from cache",
            input: {
                loadType: LoadType.Cache
            },
            data: {
                cacheData: {
                    assetsDictionary: [{
                        assetId: 9n,
                        creationTime: 1708803516699538823n,
                        logo: "",
                        modificationTime: 1708999855546228757n,
                        name: "Wrapped toy token",
                        symbol: "MYX.H"
                    },
                    {
                        assetId: 12n,
                        creationTime: 1708804657115229734n,
                        logo: "",
                        modificationTime: 1709000250392628622n,
                        name: "Wrapped ckBTC",
                        symbol: "ckBTC.H"
                    },
                    {
                        assetId: 10n,
                        creationTime: 1708804696491824815n,
                        logo: "",
                        modificationTime: 1709000260501657595n,
                        name: "Wrapped ckETH",
                        symbol: "ckETH.H"
                    },
                    {
                        assetId: 11n,
                        creationTime: 1708804726582723604n,
                        logo: "",
                        modificationTime: 1709000275024996100n,
                        name: "Wrapped ICP",
                        symbol: "ICP.H"
                    },
                    {
                        assetId: 0n,
                        creationTime: 1708914536288306446n,
                        logo: "",
                        modificationTime: 1708998770438006134n,
                        name: "Native toy token",
                        symbol: "ABC"
                    }]
                } as HplDictionaryDataCacheModel
            },
            result: [{
                assetId: 9n,
                creationTime: 1708803516699538823n,
                logo: "",
                modificationTime: 1708999855546228757n,
                name: "Wrapped toy token",
                symbol: "MYX.H"
            },
            {
                assetId: 12n,
                creationTime: 1708804657115229734n,
                logo: "",
                modificationTime: 1709000250392628622n,
                name: "Wrapped ckBTC",
                symbol: "ckBTC.H"
            },
            {
                assetId: 10n,
                creationTime: 1708804696491824815n,
                logo: "",
                modificationTime: 1709000260501657595n,
                name: "Wrapped ckETH",
                symbol: "ckETH.H"
            },
            {
                assetId: 11n,
                creationTime: 1708804726582723604n,
                logo: "",
                modificationTime: 1709000275024996100n,
                name: "Wrapped ICP",
                symbol: "ICP.H"
            },
            {
                assetId: 0n,
                creationTime: 1708914536288306446n,
                logo: "",
                modificationTime: 1708998770438006134n,
                name: "Native toy token",
                symbol: "ABC"
            }]
        },
        {
            name: "get accounts from cache, cache is empty",
            input: {
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
            },
            result: [{
                assetId: 9n,
                creationTime: 1708803516699538823n,
                logo: "",
                modificationTime: 1708999855546228757n,
                name: "Wrapped toy token",
                symbol: "MYX.H"
            },
            {
                assetId: 12n,
                creationTime: 1708804657115229734n,
                logo: "",
                modificationTime: 1709000250392628622n,
                name: "Wrapped ckBTC",
                symbol: "ckBTC.H"
            },
            {
                assetId: 10n,
                creationTime: 1708804696491824815n,
                logo: "",
                modificationTime: 1709000260501657595n,
                name: "Wrapped ckETH",
                symbol: "ckETH.H"
            },
            {
                assetId: 11n,
                creationTime: 1708804726582723604n,
                logo: "",
                modificationTime: 1709000275024996100n,
                name: "Wrapped ICP",
                symbol: "ICP.H"
            },
            {
                assetId: 0n,
                creationTime: 1708914536288306446n,
                logo: "",
                modificationTime: 1708998770438006134n,
                name: "Native toy token",
                symbol: "ABC"
            }]
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("a");

            const cacheRepository = new (<new () => HplDictionaryCacheRepository><unknown>HplDictionaryCacheRepository)() as jest.Mocked<HplDictionaryCacheRepository>;
            cacheRepository.getHplDictionaryByCanisterId = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplDictionary = jest.fn().mockReturnValue(undefined);
            const logger = new MockLogger();
            const hplDictionaryCacheDataHandler = new HplDictionaryCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);
            const result = await hplDictionaryCacheDataHandler.handle(test.input);
            let formatedResult = result.data?.assetsDictionary.map((a: any) => {

                return {
                    ...a,
                    logo: ""
                };
            });
            expect(formatedResult).toEqual(test.result);

        }, 10000);
    }

})