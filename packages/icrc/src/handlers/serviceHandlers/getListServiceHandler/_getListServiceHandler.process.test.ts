import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListServiceHandler } from "@icrc/handlers/serviceHandlers/getListServiceHandler/getListServiceHandler";
import { SupportedAssetsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/supportedAssetsCacheHandler/supportedAssetsCacheHandler";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { LoadServiceAssetsHandler } from "@icrc/internalHandlers/service/loadServiceAssetsHandler";
import { AssetRepository } from "@icrc/repositories";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { GetServiceListForm } from "@icrc/types/forms";

describe("GetListServiceHandler Process Tests", () => {
    const validForm: GetServiceListForm = {
        loadType: LoadType.Quick,
    };

    const tests: testDefinition[] = [
        {
            name: "GetListServiceHandler: Successfully retrieves service list with assets",
            input: { ...validForm },
            data: {
                services: [
                    { principal: "service-1", name: "Service 1", assets: [{ ledgerAddress: "asset-1" }] },
                ],
                tokens: [{ ledgerAddress: "asset-1", symbol: "SYM1", name: "Asset 1" }],
                supportedAssets: ["asset-1"],
                loadServiceAssetsResults: [
                    {
                        isSuccess: true,
                        data: {
                            servicePrincipal: "service-1",
                            assets: [{
                                ledgerAddress: "asset-1",
                                balance: BigInt(100),
                                symbol: "SYM1",
                                name: "Asset 1",
                                tokenName: "Asset 1",
                            }],
                        },
                    },
                ],
            },
            result: {
                services: [
                    {
                        servicePrincipal: "service-1",
                        serviceName: "Service 1",
                        availableAssets: [
                            { ledgerAddress: "asset-1", symbol: "SYM1", name: "Asset 1" },
                        ],
                        serviceAssets: [
                            {
                                ledgerAddress: "asset-1",
                                balance: 100n,
                                symbol: "SYM1",
                                name: "Asset 1",
                                logo: "",
                                isSync: true
                            },
                        ],
                        isSync: true,
                    },
                ],
            },
        },
        {
            name: "GetListServiceHandler: Successfully no data",
            input: { ...validForm },
            data: {
                services: [
                    { principal: "service-1", name: "Service 1", assets: [{ ledgerAddress: "asset-1" }] },
                ],
                tokens: undefined,
                supportedAssets: undefined,
                loadServiceAssetsResults: undefined
            },
            result: {
                services: [
                    {
                        serviceAssets:
                            [
                                {
                                    ledgerAddress: "asset-1",
                                    logo: "",
                                    balance: 0n,
                                    credit: 0n,
                                    depositFee: 0n,
                                    withdrawFee: 0n,
                                    isSync: false
                                }],
                        serviceName: "Service 1",
                        servicePrincipal: "service-1",
                        availableAssets: [],
                        isSync: false
                    }]
            },
        },
        {
            name: "GetListServiceHandler: No services available",
            input: { ...validForm },
            data: {
                services: [],
            },
            result: { services: [] },
        }
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const getTokenSNSInternalHandler = new (<new () => GetTokenSNSCacheHandler><unknown>GetTokenSNSCacheHandler)() as jest.Mocked<GetTokenSNSCacheHandler>;
        const supportedAssetsHandler = new (<new () => SupportedAssetsCacheHandler><unknown>SupportedAssetsCacheHandler)() as jest.Mocked<SupportedAssetsCacheHandler>;
        const loadServiceAssetsHandler = new (<new () => LoadServiceAssetsHandler><unknown>LoadServiceAssetsHandler)() as jest.Mocked<LoadServiceAssetsHandler>;

        serviceRepository.getServices = jest.fn().mockResolvedValue(test.data?.services);
        assetRepository.getTokensOrDefault = jest.fn().mockResolvedValue(test.data?.tokens);

        getTokenSNSInternalHandler.handle = jest.fn().mockResolvedValue({
            data: { TokenList: test.data?.tokens },
        });
        supportedAssetsHandler.handle = jest.fn().mockResolvedValue({
            data: { principals: test.data?.supportedAssets },
        });

        loadServiceAssetsHandler.handle = jest.fn().mockResolvedValue(test.data?.loadServiceAssetsResults?.[0] ?? {});

        const handler = new GetListServiceHandler(logger, serviceRepository, assetRepository, getTokenSNSInternalHandler, supportedAssetsHandler, loadServiceAssetsHandler);

        await handler.validate(test.input);

        const result = await handler.process(test.input);

        expect(result).toEqual(test.result);

        expect(serviceRepository.getServices).toHaveBeenCalled();

        if (test.data?.supportedAssets) {
            expect(assetRepository.getTokensOrDefault).toHaveBeenCalled();
        }

    });
});
