import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { LoadHplAssetResult } from "@hpl/forms";
import { GetHplAssetListHandler } from "@hpl/handlers/assets/getHplAssetListHandler/getHplAssetListHandler";
import { LoadHplAssetHandler } from "@hpl/internalHandlers";
import { HplAssetRepository } from "@hpl/repositories";
import { HplAssetDataModel } from "@hpl/types";
import { LoadType } from "@ic-wallet-middleware/common";

describe("Unit GetHplAssetListHandler tests", () => {
    const validData = {
        loadData: {
            ftAssets: [
                {
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    controller: "2vxsx-fae",
                    decimal: 0,
                    description: "Default",
                    id: BigInt(0),
                    logo: "",
                    supply: BigInt(21015),
                    ledgerBalance: BigInt(0)
                },
                {
                    assetName: "",
                    assetSymbol: "",
                    controller: "hrrr3-iiaaa-aaaap-abqla-cai",
                    decimal: 8,
                    description: "Wrapped MYX",
                    id: BigInt(2),
                    logo: "",
                    supply: BigInt(84),
                    ledgerBalance: BigInt(0)
                }
            ]
        } as LoadHplAssetResult,
        storageData: [
            {
                assetName: "Native toy token",
                assetSymbol: "ABC",
                id: "0",
                name: "",
                symbol: ""
            },
            {
                assetName: "",
                assetSymbol: "",
                id: "2",
                name: "Test",
                symbol: "Test"
            }

        ] as HplAssetDataModel[]
    }

    const testData = [
        {
            name: "GetHplAssetListHandler: success",
            input: {
                loadType: LoadType.Full
            },
            data: validData,
            result: {
                ftAssets: [{
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    controller: "2vxsx-fae",
                    decimal: 0,
                    description: "Default",
                    id: BigInt(0),
                    logo: "",
                    name: "",
                    symbol: "",
                    supply: BigInt(21015),
                    ledgerBalance: BigInt(0)
                },
                {
                    assetName: "",
                    assetSymbol: "",
                    controller: "hrrr3-iiaaa-aaaap-abqla-cai",
                    decimal: 8,
                    description: "Wrapped MYX",
                    id: BigInt(2),
                    logo: "",
                    name: "Test",
                    symbol: "Test",
                    supply: BigInt(84),
                    ledgerBalance: BigInt(0)
                }]
            }
        },
        {
            name: "GetHplAssetListHandler: db is empty",
            input: {
                loadType: LoadType.Full
            },
            data: {
                ...validData,
                storageData: []
            },
            result: {
                ftAssets: [{
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    controller: "2vxsx-fae",
                    decimal: 0,
                    description: "Default",
                    id: BigInt(0),
                    logo: "",
                    name: "",
                    symbol: "",
                    supply: BigInt(21015),
                    ledgerBalance: BigInt(0)
                },
                {
                    assetName: "",
                    assetSymbol: "",
                    controller: "hrrr3-iiaaa-aaaap-abqla-cai",
                    decimal: 8,
                    description: "Wrapped MYX",
                    id: BigInt(2),
                    logo: "",
                    name: "",
                    symbol: "",
                    supply: BigInt(84),
                    ledgerBalance: BigInt(0)
                }]
            }
        }
    ]

    itForeach(testData, async (test) => {
        const loadHplAssetHandler = new (<new () => LoadHplAssetHandler><unknown>LoadHplAssetHandler)() as jest.Mocked<LoadHplAssetHandler>;
        loadHplAssetHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.loadData));
        const hplAssetRepository = new (<new () => HplAssetRepository><unknown>HplAssetRepository)() as jest.Mocked<HplAssetRepository>;
        hplAssetRepository.getAssets = jest.fn().mockReturnValue(Promise.resolve(test.data.storageData));
        hplAssetRepository.addAsset = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const logger = new MockLogger();
        const getHplAssetListHandler = new GetHplAssetListHandler(logger, loadHplAssetHandler, hplAssetRepository);
        await getHplAssetListHandler.validate(test.input);
        const result = await getHplAssetListHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(loadHplAssetHandler.process).toHaveBeenCalledWith({
            loadType: test.input.loadType
        });

        if (test.data.storageData.length === 0) {
            const assets = test.data.loadData.ftAssets;
            assets.forEach((asset) => {
                expect(hplAssetRepository.addAsset).toHaveBeenCalledWith(
                    expect.objectContaining({
                        id: asset.id.toString(),
                        name: "",
                        symbol: "",
                        assetName: asset.assetName,
                        assetSymbol: asset.assetSymbol,
                        logo: asset.logo
                    })
                );
            });
        }

    });
})
