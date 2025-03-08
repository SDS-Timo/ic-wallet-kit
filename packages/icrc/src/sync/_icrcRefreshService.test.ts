import { RefreshServiceConfiguration } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListAllowanceHandler, GetListAssetHandler, GetListContactHandler, GetListServiceHandler } from "@icrc/handlers";
import { IcrcRxSyncStateService } from "@icrc/replications";
import { IcrcRefreshService } from "@icrc/sync/icrcRefreshService";



describe("IcrcRefreshService Tests", () => {
    const mockConfiguration = {} as RefreshServiceConfiguration;

    const tests: testDefinition[] = [
        {
            name: "IcrcRefreshService: Successfully syncs all data",
            data: {
                assetListResult: { isSuccess: true, data: { assets: [{ ledgerAddress: "mock-ledger-1" }, { ledgerAddress: "mock-ledger-2" }] } },
                allowanceResults: [{ isSuccess: true }, { isSuccess: true }],
                contactListResult: { isSuccess: true },
                serviceListResult: { isSuccess: true },
            },
            result: true,
            input: {}
        },
        {
            name: "IcrcRefreshService: Fails when asset list retrieval fails",
            data: {
                assetListResult: { isSuccess: false },
            },
            result: false,
            input: {}
        },
        {
            name: "IcrcRefreshService: Fails when any allowance retrieval fails",
            data: {
                assetListResult: { isSuccess: true, data: { assets: [{ ledgerAddress: "mock-ledger-1" }] } },
                allowanceResults: [{ isSuccess: false }],
                contactListResult: { isSuccess: true },
                serviceListResult: { isSuccess: true },
            },
            result: false,
            input: {}
        },
        {
            name: "IcrcRefreshService: Fails when contact list retrieval fails",
            data: {
                assetListResult: { isSuccess: true, data: { assets: [] } },
                contactListResult: { isSuccess: false },
                serviceListResult: { isSuccess: true },
            },
            result: false,
            input: {}
        },
        {
            name: "IcrcRefreshService: Fails when service list retrieval fails",
            data: {
                assetListResult: { isSuccess: true, data: { assets: [] } },
                contactListResult: { isSuccess: true },
                serviceListResult: { isSuccess: false },
            },
            result: false,
            input: {}
        },
    ];

    itForeach(tests, async (test) => {

        const getListAssetHandler = new (<new () => GetListAssetHandler><unknown>GetListAssetHandler)() as jest.Mocked<GetListAssetHandler>;
        const getListAllowanceHandler = new (<new () => GetListAllowanceHandler><unknown>GetListAllowanceHandler)() as jest.Mocked<GetListAllowanceHandler>;
        const getListContactHandler = new (<new () => GetListContactHandler><unknown>GetListContactHandler)() as jest.Mocked<GetListContactHandler>;
        const getListServiceHandler = new (<new () => GetListServiceHandler><unknown>GetListServiceHandler)() as jest.Mocked<GetListServiceHandler>;
        const rxSyncStateService = new (<new () => IcrcRxSyncStateService><unknown>IcrcRxSyncStateService)() as jest.Mocked<IcrcRxSyncStateService>;

        // Static Mocks
        getListAssetHandler.handle = jest.fn().mockResolvedValue(test.data?.assetListResult ?? { isSuccess: true, data: { assets: [] } });
        getListContactHandler.handle = jest.fn().mockResolvedValue(test.data?.contactListResult ?? { isSuccess: true });
        getListServiceHandler.handle = jest.fn().mockResolvedValue(test.data?.serviceListResult ?? { isSuccess: true });

        if (test.data?.allowanceResults) {
            getListAllowanceHandler.handle = jest.fn()
                .mockResolvedValueOnce(test.data.allowanceResults[0])
                .mockResolvedValueOnce(test.data.allowanceResults[1] ?? { isSuccess: true });
        } else {
            getListAllowanceHandler.handle = jest.fn().mockResolvedValue({ isSuccess: true });
        }

        const handler = new IcrcRefreshService(
            getListAssetHandler,
            getListAllowanceHandler,
            getListContactHandler,
            getListServiceHandler,
            mockConfiguration,
            rxSyncStateService
        );

        const result = await handler.runSync();
        expect(result).toBe(test.result);
    });
});
