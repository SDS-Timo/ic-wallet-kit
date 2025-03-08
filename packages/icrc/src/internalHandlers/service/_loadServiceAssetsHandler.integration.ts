import { FormResult, LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { AllCreditsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/allCreditsCacheHandler/allCreditsCacheHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceAssetDetailsHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { LoadServiceAssetsHandler } from "@icrc/internalHandlers/service/loadServiceAssetsHandler";

describe("Unit LoadServiceAssetsHandler tests", () => {
    const testData = [
        {
            name: "load service assets",
            input: {
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddresses: ["ryjl3-tyaaa-aaaaa-aaaba-cai"],
                loadType: LoadType.Full
            },
            data: {
                cacheData: {
                    credits: [
                        {
                            ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                            credit: BigInt(1)
                        }
                    ],
                    serviceAssetDeposit: BigInt(0),
                    assetDetail: {
                        allowanceFee: BigInt(10000),
                        withdrawalFee: BigInt(10000),
                        depositFee: BigInt(10000),
                    }
                },
            },
            result: FormResult.success({
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                assets: [{
                    tokenSymbol: "",
                    tokenName: "",
                    decimal: undefined,
                    shortDecimal: undefined,
                    logo: "",
                    balance: BigInt(0),
                    credit: BigInt(1),
                    depositFee: BigInt(10000),
                    withdrawFee: BigInt(10000),
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    isSync: true,
                }]
            })
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();
            const allCreditsHandler = new (<new () => AllCreditsCacheHandler><unknown>AllCreditsCacheHandler)() as jest.Mocked<AllCreditsCacheHandler>;
            allCreditsHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.cacheData));
            const serviceAssetDetailsHandler = new (<new () => ServiceAssetDetailsHandler><unknown>ServiceAssetDetailsHandler)() as jest.Mocked<ServiceAssetDetailsHandler>;
            serviceAssetDetailsHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.cacheData));
            const serviceAssetDepositHandler = new (<new () => ServiceAssetDepositHandler><unknown>ServiceAssetDepositHandler)() as jest.Mocked<ServiceAssetDepositHandler>;
            serviceAssetDepositHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.cacheData));
            const logger = new MockLogger();
            const loadServiceAssetsHandler = new LoadServiceAssetsHandler(logger,
                allCreditsHandler,
                serviceAssetDetailsHandler,
                serviceAssetDepositHandler);
            const result = await loadServiceAssetsHandler.handle(test.input);
            expect(result).toEqual(test.result);


        }, 10000);
    }

})