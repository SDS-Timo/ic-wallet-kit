import { ValidationError } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockAssetManagerConfiguration, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { AddAllowanceHandler } from "@icrc/handlers/allowanceHandlers/addAllowanceHandler/addAllowanceHandler";
import { AddIcrcAllowanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/addIcrcAllowanceHandler/addIcrcAllowanceHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AllowanceRepository, AssetRepository } from "@icrc/repositories";

import { SubAccountId } from "@icrc/types";


describe("Unit AddAllowanceHandler validate tests", () => {

    const tests = [
        {
            name: "add allowance: Balance should be more that ledger fee",
            input: {
                amount: "10",
                ledgerAddress: "xxx",
                spenderPrincipal: mockSpenderPrincipalString(),
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.Default(),
                expiration: undefined
            },
            data: {
                asset: {
                    symbol: "xx",
                    name: "aName",
                    decimals: 8,
                    logo: "",
                    fee: 1000n,
                },
                balance: {
                    subAccountId: SubAccountId.Default(),
                    balance: 1n
                }
            },
            result: {},
            error: new ValidationError("balance.less.fee",
                "",
                "Balance should be more that ledger fee")

        },
        {
            name: "add allowance: Amount should be more that ledger fee",
            input: {
                amount: "0.00000001",
                ledgerAddress: "xxx",
                spenderPrincipal: mockSpenderPrincipalString(),
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.Default(),
                expiration: undefined
            },
            data: {
                asset: {
                    symbol: "xx",
                    name: "aName",
                    decimals: 8,
                    logo: "",
                    fee: 1000n,
                },
                balance: {
                    subAccountId: SubAccountId.Default(),
                    balance: 100000n
                },
                supportedStandard: true
            },
            result: {},
            error: new ValidationError("amount.less.fee", "", "Amount should be more that ledger fee")
        },
        {
            name: "add allowance: Invalid amount",
            input: {
                amount: "",
                ledgerAddress: "xxx",
                spenderPrincipal: mockSpenderPrincipalString(),
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.Default(),
                expiration: undefined
            },
            data: {
                asset: {
                    symbol: "xx",
                    name: "aName",
                    decimals: 8,
                    logo: "",
                    fee: 1000n,
                },
                balance: {
                    subAccountId: SubAccountId.Default(),
                    balance: 100000n
                }
            },
            result: {},
            error: new ValidationError("transfer.allowance.invalid.amount", "amount", "Invalid amount")
        },
        {
            name: "add allowance: Asset not supported standard ICRC-2",
            input: {
                amount: "0.01",
                ledgerAddress: "xxx",
                spenderPrincipal: mockSpenderPrincipalString(),
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.Default(),
                expiration: undefined
            },
            data: {
                asset: {
                    symbol: "xx",
                    name: "aName",
                    decimals: 8,
                    logo: "",
                    fee: 1000n,
                },
                balance: {
                    subAccountId: SubAccountId.Default(),
                    balance: 10000000000n
                },
                supportedStandard: false
            },
            result: {},
            error: new ValidationError("asset.not.supported.standard", "", "Asset not supported standard ICRC-2")
        },
        {
            name: "add allowance: success",
            input: {
                amount: "0.01",
                ledgerAddress: "xxx",
                spenderPrincipal: mockSpenderPrincipalString(),
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.Default(),
                expiration: undefined
            },
            data: {
                asset: {
                    symbol: "xx",
                    name: "aName",
                    decimals: 8,
                    logo: "",
                    fee: 1000n,
                },
                balance: {
                    subAccountId: SubAccountId.Default(),
                    balance: 10000000000n
                },
                supportedStandard: true
            },
            result: {
                ledgerAddress: "qqq",
                subAccountId: SubAccountId.Default(),
                spenderPrincipal: mockSpenderPrincipalString(),
                spenderSubId: SubAccountId.Default(),
                amount: 10,
                expiration: undefined
            },
            error: undefined
        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const allowanceRepository = new (<new () => AllowanceRepository><unknown>AllowanceRepository)() as jest.Mocked<AllowanceRepository>;
        const addIcrcAllowanceHandler = new (<new () => AddIcrcAllowanceHandler><unknown>AddIcrcAllowanceHandler)() as jest.Mocked<AddIcrcAllowanceHandler>;
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;


        const assetResult = test.data.asset;
        assetMetaDataHandler.handle = jest.fn().mockReturnValue(assetResult);

        const balanceResult = test.data.balance;
        subAccountBalanceHandler.handle = jest.fn().mockReturnValue(balanceResult);

        assetRepository.checkSupportedStandard = jest.fn().mockReturnValue(test.data.supportedStandard);

        allowanceRepository.addAllowance = jest.fn().mockReturnValue("");

        addIcrcAllowanceHandler.process = jest.fn().mockReturnValue(test.result);


        const addAllowanceHandler = new AddAllowanceHandler(logger,
            assetMetaDataHandler,
            assetRepository,
            allowanceRepository,
            addIcrcAllowanceHandler,
            mockAssetManagerConfiguration,
            subAccountBalanceHandler
        );

        const result = await addAllowanceHandler.process(test.input);

        expect(result).toEqual(test.result);
    });

});
