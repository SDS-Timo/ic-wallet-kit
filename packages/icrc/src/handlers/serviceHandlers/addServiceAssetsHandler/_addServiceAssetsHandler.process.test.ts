import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddServiceAssetsHandler } from "@icrc/handlers/serviceHandlers/addServiceAssetsHandler/addServiceAssetsHandler";
import { LoadServiceAssetsHandler } from "@icrc/internalHandlers/service/loadServiceAssetsHandler";
import { AssetRepository } from "@icrc/repositories";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { AddServiceAssetListForm } from "@icrc/types/forms";


describe("AddServiceAssetsHandler Process Tests", () => {
    const validForm: AddServiceAssetListForm = {
        servicePrincipal: "mock-service-principal",
        ledgerAddresses: ["mock-ledger-address-1", "mock-ledger-address-2"],
    };

    const tests: testDefinition[] = [
        {
            name: "AddServiceAssetsHandler: Successfully processes assets",
            input: { ...validForm },
            data: {
                assetList: [
                    { ledgerAddress: "mock-ledger-address-1", name: "Token A", symbol: "TKA", shortDecimal: 8, logo: "logo-a" },
                    { ledgerAddress: "mock-ledger-address-2", name: "Token B", symbol: "TKB", shortDecimal: 6, logo: "logo-b" },
                ],
                loadServiceAssets: {
                    data: {
                        assets: [
                            { ledgerAddress: "mock-ledger-address-1", balance: BigInt(1000), credit: BigInt(500) },
                            { ledgerAddress: "mock-ledger-address-2", balance: BigInt(2000), credit: BigInt(1000) },
                        ],
                    },
                },
                serviceAssets: [
                    { ledgerAddress: "mock-ledger-address-1", tokenName: "Token A", tokenSymbol: "TKA", decimal: 8, shortDecimal: 8, logo: "logo-a" },
                    { ledgerAddress: "mock-ledger-address-2", tokenName: "Token B", tokenSymbol: "TKB", decimal: 6, shortDecimal: 6, logo: undefined },
                ],
            },
            result: {
                assets: [
                    { ledgerAddress: "mock-ledger-address-1", tokenName: "Token A", tokenSymbol: "TKA", decimal: 8, shortDecimal: 8, logo: "logo-a", balance: BigInt(1000), credit: BigInt(500), isSync: true },
                    { ledgerAddress: "mock-ledger-address-2", tokenName: "Token B", tokenSymbol: "TKB", decimal: 6, shortDecimal: 6, logo: "", balance: BigInt(2000), credit: BigInt(1000), isSync: true },
                ],
            },
        },
        {
            name: "AddServiceAssetsHandler: Successfully processes, assets  undefined",
            input: { ...validForm },
            data: {
                assetList: [
                    { ledgerAddress: "mock-ledger-address-1", name: "Token A", symbol: "TKA", shortDecimal: 8, logo: "logo-a" },
                    { ledgerAddress: "mock-ledger-address-2", name: "Token B", symbol: "TKB", shortDecimal: 6, logo: "logo-b" },
                ],
                loadServiceAssets: {
                    data: {
                        assets: undefined,
                    },
                },
                serviceAssets: [
                    { ledgerAddress: "mock-ledger-address-1", tokenName: "Token A", tokenSymbol: "TKA", decimal: 8, shortDecimal: 8, logo: "logo-a" },
                    { ledgerAddress: "mock-ledger-address-2", tokenName: "Token B", tokenSymbol: "TKB", decimal: 6, shortDecimal: 6, logo: undefined },
                ],
            },
            result: {
                assets: [
                    {
                        ledgerAddress: "mock-ledger-address-1", tokenName: "Token A", tokenSymbol: "TKA", decimal: 8, shortDecimal: 8, logo: "logo-a", balance: 0n,
                        depositFee: BigInt(0), withdrawFee: BigInt(0), credit: 0n, isSync: false
                    },
                    {
                        ledgerAddress: "mock-ledger-address-2", tokenName: "Token B", tokenSymbol: "TKB", decimal: 6, shortDecimal: 6, logo: "", balance: 0n,
                        depositFee: BigInt(0), withdrawFee: BigInt(0), credit: 0n, isSync: false
                    },
                ],
            },
        },
        {
            name: "AddServiceAssetsHandler: Handles missing assets in repository",
            input: { ...validForm },
            data: {
                assetList: [],
                loadServiceAssets: {
                    data: { assets: [] },
                },
                serviceAssets: [],
            },
            result: { assets: [] },
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const serviceRepository = new (<new () => ServiceRepository><unknown>ServiceRepository)() as jest.Mocked<ServiceRepository>;
        const loadServiceAssetsHandler = new (<new () => LoadServiceAssetsHandler><unknown>LoadServiceAssetsHandler)() as jest.Mocked<LoadServiceAssetsHandler>;

        // Static mocks
        assetRepository.getTokensOrDefault = jest.fn().mockResolvedValue(test.data?.assetList ?? []);
        loadServiceAssetsHandler.handle = jest.fn().mockResolvedValue(test.data?.loadServiceAssets ?? {});
        serviceRepository.addServiceAssets = jest.fn().mockResolvedValue(test.data?.serviceAssets ?? []);

        const handler = new AddServiceAssetsHandler(logger, serviceRepository, assetRepository, loadServiceAssetsHandler);

        await handler.validate(test.input);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(assetRepository.getTokensOrDefault).toHaveBeenCalled();
        expect(loadServiceAssetsHandler.handle).toHaveBeenCalledWith({
            servicePrincipal: test.input.servicePrincipal,
            ledgerAddresses: test.input.ledgerAddresses,
            loadType: LoadType.Quick
        });
        expect(serviceRepository.addServiceAssets).toHaveBeenCalledWith(
            test.input.servicePrincipal,
            expect.any(Array)
        );

    });
});
