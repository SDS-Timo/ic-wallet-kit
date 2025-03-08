import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockAssetManagerConfiguration, mockIndexAddress, mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListAssetHandler } from "@icrc/handlers/assetHandlers/getListAssetHandler/getListAssetHandler";
import { LoadAssetHandler } from "@icrc/internalHandlers/loadAssetHandler/loadAssetHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";
import { AssetManagerConfiguration } from "@icrc/types/configuration/assetManagerConfiguration";
import { GetAssetListForm } from "@icrc/types/forms";

describe("GetListAssetHandler Process Tests", () => {
    const validForm: GetAssetListForm = {
        loadType: LoadType.Quick
    };

    const tests: testDefinition[] = [
        {
            name: "GetListAssetHandler: Successful load of assets",
            input: { ...validForm },
            data: {
                assetList: [
                    {
                        ledgerAddress: mockLedgerAddress,
                        indexAddress: mockIndexAddress,
                        name: "Asset 1",
                        tokenName: "Token 1",
                        sortOrder: 1,
                        subAccounts: [
                            { ledgerAddress: mockLedgerAddress, subAccountId: "0x0", name: "Default" },

                        ],
                        logo: "logo-1",
                        symbol: "TKN1",
                        tokenSymbol: "T1",
                        shortDecimal: 2,
                        supportedStandards: [],
                    },
                ],
                handlersResult: [
                    {
                        isSuccess: true,
                        data: {
                            ledgerAddress: mockLedgerAddress,
                            transactionFee: BigInt(100),
                            decimal: 8,
                            subAccounts: [
                                {
                                    ledgerAddress: mockLedgerAddress,
                                    subAccountId: SubAccountId.parseFromString("0x0"),
                                    balance: BigInt(1000),
                                    currencyAmount: "10.00",
                                },
                                {
                                    ledgerAddress: mockLedgerAddress,
                                    subAccountId: SubAccountId.parseFromString("0x2"),
                                    balance: BigInt(1000),
                                    currencyAmount: "10.00",
                                }
                            ],
                        },
                    },
                ],
            },
            result: {
                assets: [
                    {
                        ledgerAddress: mockLedgerAddress,
                        indexAddress: mockIndexAddress,
                        name: "Asset 1",
                        tokenName: "Token 1",
                        sortOrder: 1,
                        decimal: 8,
                        logo: "logo-1",
                        subAccounts: [
                            {
                                ledgerAddress: mockLedgerAddress,
                                name: "Default",
                                balance: BigInt(1000),
                                currencyAmount: "10.00",
                                decimal: 8,
                                subAccountId: SubAccountId.parseFromString("0x0"),
                                isSync: true,
                            },
                            {
                                ledgerAddress: mockLedgerAddress,
                                name: "-",
                                balance: BigInt(1000),
                                currencyAmount: "10.00",
                                decimal: 8,
                                subAccountId: SubAccountId.parseFromString("0x2"),
                                isSync: true,
                            }
                        ],
                        symbol: "TKN1",
                        tokenSymbol: "T1",
                        shortDecimal: 2,
                        transactionFee: BigInt(100),
                        supportedStandards: [],
                        isSync: true,
                    },
                ],
            },
        },
        {
            name: "GetListAssetHandler: Failure during asset load",
            input: { ...validForm },
            data: {
                assetList: [
                    {
                        ledgerAddress: mockLedgerAddress,
                        indexAddress: mockIndexAddress,
                        name: "Asset 1",
                        tokenName: "Token 1",
                        sortOrder: 1,
                        subAccounts: [
                            { ledgerAddress: mockLedgerAddress, subAccountId: "0x0", name: "Default" },
                        ],
                        logo: "logo-1",
                        symbol: "TKN1",
                        tokenSymbol: "T1",
                        shortDecimal: 2,
                        supportedStandards: [],
                    },
                ],
                handlersResult: [
                    {
                        isSuccess: false,
                        errors: [{ message: "Failed to load asset data", code: "load.error" }],
                    },
                ],
            },
            error: [{ message: "Failed to load asset data", code: "load.error" }],
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const loadAssetHandler = new (<new () => LoadAssetHandler><unknown>LoadAssetHandler)() as jest.Mocked<LoadAssetHandler>;
        const configuration: AssetManagerConfiguration = mockAssetManagerConfiguration;

        assetRepository.getTokensOrDefault = jest.fn().mockResolvedValue(test.data?.assetList || []);

        assetRepository.addSubAccount = jest.fn().mockResolvedValue({});

        loadAssetHandler.handle = jest.fn().mockImplementation((info) =>
            Promise.resolve(
                test.data?.handlersResult?.find(
                    (result: any) => result.data?.ledgerAddress === info.ledgerAddress
                ) || { isSuccess: false, errors: [{ message: "Failed to load asset data", code: "load.error" }] }
            )
        );

        const getListAssetHandler = new GetListAssetHandler(logger, configuration, assetRepository, loadAssetHandler);

        await getListAssetHandler.validate(test.input);

        const result = await getListAssetHandler.process(test.input);

        console.log("result", result.assets[0].subAccounts);
        console.log(test.result.assets[0].subAccounts);

        expect(result).toEqual(test.result);

    });
});
