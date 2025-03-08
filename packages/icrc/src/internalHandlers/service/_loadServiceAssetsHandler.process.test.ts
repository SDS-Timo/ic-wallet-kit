import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AllCreditsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/allCreditsCacheHandler/allCreditsCacheHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceAssetDetailsHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { LoadServiceAssetsHandler } from "@icrc/internalHandlers/service/loadServiceAssetsHandler";
import { LoadServiceAssetsForm } from "@icrc/types/forms/services";

describe("LoadServiceAssetsHandler: process tests", () => {
    const validForm: LoadServiceAssetsForm = {
        servicePrincipal: "mock-service-principal",
        ledgerAddresses: ["ledger-1", "ledger-2"],
        loadType: LoadType.Quick,
    };

    const tests: testDefinition[] = [
        {
            name: "LoadServiceAssetsHandler: Successfully loads service assets",
            input: { ...validForm },
            data: {
                allCreditsResult: {
                    credits: [
                        { ledgerAddress: "ledger-1", credit: BigInt(1000) },
                        { ledgerAddress: "ledger-2", credit: BigInt(2000) },
                    ],
                },
                assetDetailsResults: [
                    {
                        assetDetail: {
                            depositFee: BigInt(10),
                            withdrawalFee: BigInt(5),
                        },
                    },
                    {
                        assetDetail: {
                            depositFee: BigInt(20),
                            withdrawalFee: BigInt(10),
                        },
                    },
                ],
                assetDepositResults: [
                    { serviceAssetDeposit: BigInt(5000) },
                    { serviceAssetDeposit: BigInt(10000) },
                ],
            },
            result: {
                servicePrincipal: "mock-service-principal",
                assets: [
                    {
                        tokenSymbol: "",
                        tokenName: "",
                        logo: "",
                        decimal: undefined,
                        shortDecimal: undefined,
                        balance: BigInt(5000),
                        ledgerAddress: "ledger-1",
                        credit: BigInt(1000),
                        depositFee: BigInt(10),
                        withdrawFee: BigInt(5),
                        isSync: true,
                    },
                    {
                        tokenSymbol: "",
                        tokenName: "",
                        logo: "",
                        decimal: undefined,
                        shortDecimal: undefined,
                        balance: BigInt(10000),
                        ledgerAddress: "ledger-2",
                        credit: BigInt(2000),
                        depositFee: BigInt(20),
                        withdrawFee: BigInt(10),
                        isSync: true,
                    },
                ],
            },
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const allCreditsHandler = new (<new () => AllCreditsCacheHandler>(<unknown>AllCreditsCacheHandler))() as jest.Mocked<AllCreditsCacheHandler>;
        const serviceAssetDetailsHandler = new (<new () => ServiceAssetDetailsHandler>(<unknown>ServiceAssetDetailsHandler))() as jest.Mocked<ServiceAssetDetailsHandler>;
        const serviceAssetDepositHandler = new (<new () => ServiceAssetDepositHandler>(<unknown>ServiceAssetDepositHandler))() as jest.Mocked<ServiceAssetDepositHandler>;

        allCreditsHandler.process = jest.fn().mockResolvedValue(test.data?.allCreditsResult);
        serviceAssetDetailsHandler.process = jest.fn().mockResolvedValueOnce(test.data?.assetDetailsResults[0])
            .mockResolvedValueOnce(test.data?.assetDetailsResults[1]);
        serviceAssetDepositHandler.process = jest.fn().mockResolvedValueOnce(test.data?.assetDepositResults[0])
            .mockResolvedValueOnce(test.data?.assetDepositResults[1]);

        const handler = new LoadServiceAssetsHandler(
            logger,
            allCreditsHandler,
            serviceAssetDetailsHandler,
            serviceAssetDepositHandler
        );

        await handler.validate(test.input);
        const result = await handler.process(test.input);

        expect(result).toEqual(test.result);
        expect(allCreditsHandler.process).toHaveBeenCalledWith({
            servicePrincipal: test.input.servicePrincipal,
            loadType: test.input.loadType,
        });

        test.input.ledgerAddresses.forEach((ledgerAddress: any, index: any) => {
            expect(serviceAssetDetailsHandler.process).toHaveBeenCalledWith({
                servicePrincipal: test.input.servicePrincipal,
                ledgerAddress,
                loadType: test.input.loadType,
            });

            expect(serviceAssetDepositHandler.process).toHaveBeenCalledWith({
                servicePrincipal: test.input.servicePrincipal,
                ledgerAddress,
                loadType: test.input.loadType,
            });
        });
    });
});
