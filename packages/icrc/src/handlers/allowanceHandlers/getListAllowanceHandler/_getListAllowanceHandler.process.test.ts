import { LoadType, ValidationError } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockAssetManagerConfiguration, mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListAllowanceHandler } from "@icrc/handlers/allowanceHandlers/getListAllowanceHandler/getListAllowanceHandler";
import { GetIcrcAllowanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceCacheHandler/getIcrcAllowanceCacheHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";

import { AllowanceRepository, AssetRepository } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";

describe("Unit GetListAllowanceHandler validate tests", () => {

    const valid = {
        ledgerAddress: mockLedgerAddress,
        loadType: LoadType.Cache
    };

    const tests: testDefinition[] = [
        {
            name: "GetListAllowanceHandler: Asset Not Found",
            input: valid,
            data: {
                assetMetaData: undefined
            },
            error: new ValidationError("asset.not.found",
                "ledgerAddress",
                "Asset Not Found")
        },
        {
            name: "GetListAllowanceHandler: error on getIcrcAllowanceHandler side",
            input: valid,
            data: {
                assetMetaData: {
                    decimals: 8
                },
                allowances: [{
                    ledgerAddress: mockLedgerAddress,
                    subAccountId: "0x5",
                    spenderPrincipal: mockSpenderPrincipalString(),
                    spenderSubId: "0x6",
                },
                {
                    ledgerAddress: "ledgerAddress",
                    subAccountId: "0x10",
                    spenderPrincipal: mockSpenderPrincipalString(),
                    spenderSubId: "0x11"
                },
                {
                    ledgerAddress: "ledgerAddress",
                    subAccountId: "0x20",
                    spenderPrincipal: mockSpenderPrincipalString(),
                    spenderSubId: "0x21"
                }]
            },
            error: new Error(`test error 0x10`)
        },
        {
            name: "GetListAllowanceHandler: success",
            input: valid,
            data: {
                assetMetaData: {
                    decimals: 8
                },
                allowances: [{
                    ledgerAddress: mockLedgerAddress,
                    subAccountId: "0x5",
                    spenderPrincipal: mockSpenderPrincipalString(),
                    spenderSubId: "0x6",
                }]
            },
            result: {
                allowances: [
                    {
                        spenderPrincipal: 'lrxaf-gyaca',
                        spenderSubId: SubAccountId.parseFromString("0x6"),
                        ledgerAddress: 'test-ledger-address',
                        subAccountId: SubAccountId.parseFromString("0x5"),
                        amount: 10n,
                        decimal: 8,
                        expiration: undefined
                    }
                ]
            }
        },
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const allowanceRepository = new (<new () => AllowanceRepository><unknown>AllowanceRepository)() as jest.Mocked<AllowanceRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const getIcrcAllowanceHandler = new (<new () => GetIcrcAllowanceCacheHandler><unknown>GetIcrcAllowanceCacheHandler)() as jest.Mocked<GetIcrcAllowanceCacheHandler>;
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;

        assetRepository.getAssetOrDefault = jest.fn().mockResolvedValue(test.data?.assetMetaData);
        allowanceRepository.getAssetAllowances = jest.fn().mockResolvedValue(test.data?.allowances);
        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data?.assetMetaData);

        getIcrcAllowanceHandler.handle = jest.fn().mockImplementation(async (info) => {

            if (SubAccountId.parseFromString("0x5").equals(info.subAccountId)) {
                const result = {
                    ledgerAddress: info.ledgerAddress,
                    subAccountId: info.subAccountId.toString(),
                    spenderPrincipal: info.spenderPrincipal,
                    spenderSubId: info.spenderSubId.toString(),
                    amount: 10n,
                    expiration: undefined
                }

                return result;
            }

            throw new Error(`test error ${info.subAccountId.toString()}`);

        });

        const getListAllowanceHandler = new GetListAllowanceHandler(
            logger,
            mockAssetManagerConfiguration,
            allowanceRepository,
            assetRepository,
            getIcrcAllowanceHandler,
            assetMetaDataHandler
        );

        const result = await getListAllowanceHandler.process(test.input);

        expect(result).toEqual(test.result);

    });
});