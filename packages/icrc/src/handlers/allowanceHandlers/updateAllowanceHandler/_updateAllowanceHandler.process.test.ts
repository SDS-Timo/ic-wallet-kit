import { MockLogger } from "@icrc/__tests_utils/mockLogger";

import { mockAssetManagerConfiguration, mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { UpdateAllowanceHandler } from "@icrc/handlers/allowanceHandlers/updateAllowanceHandler/updateAllowanceHandler";

import { ValidationError } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { UpdateAllowanceForm } from "@icrc/types/forms";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit UpdateAllowanceHandler validate tests", () => {

    const valid: UpdateAllowanceForm = {
        ledgerAddress: mockLedgerAddress,
        subAccountId: SubAccountId.Default(),
        spenderPrincipal: mockSpenderPrincipalString(),
        spenderSubId: SubAccountId.Default(),
        amount: "10",
        expiration: undefined
    }

    const tests: testDefinition[] = [
        {
            name: "UpdateAllowanceHandler: Asset Not Found",
            input: valid,
            data: {
                assetMetaData: undefined
            },
            error: new ValidationError("asset.not.found",
                "ledgerAddress",
                "Asset Not Found")
        },
        {
            name: "UpdateAllowanceHandler: Balance should be more that ledger fee",
            input: valid,
            data: {
                assetMetaData: {
                    fee: 100n
                },
                subAccountBalance: {
                    balance: 10n
                }
            },
            error: new ValidationError("balance.less.fee",
                "",
                "Balance should be more that ledger fee")
        },
        {
            name: "UpdateAllowanceHandler: Invalid amount",
            input: {
                ...valid, amount: ""
            },
            data: {
                assetMetaData: {
                    fee: 10n,
                    decimals: 8
                },
                subAccountBalance: {
                    balance: 1000n
                }
            },
            error: new ValidationError("transfer.allowance.invalid.amount", "amount", "Invalid amount")
        },
        {
            name: "UpdateAllowanceHandler: Amount should be more that ledger fee",
            input: {
                ...valid, amount: "0.01"
            },
            data: {
                assetMetaData: {
                    fee: 100000000000000000000000n,
                    decimals: 8

                },
                subAccountBalance: {
                    balance: 10000000000000000000000000n
                }
            },
            error: new ValidationError("amount.less.fee",
                "",
                "Amount should be more that ledger fee")
        },
        {
            name: "UpdateAllowanceHandler: success",
            input: {
                ...valid
            },
            data: {
                assetMetaData: {
                    fee: 10n,
                    decimals: 8

                },
                subAccountBalance: {
                    balance: 100000000000n
                }
            },
            result: {
                ledgerAddress: mockLedgerAddress,
                subAccountId: SubAccountId.Default(),
                spenderPrincipal: mockSpenderPrincipalString(),
                spenderSubId: SubAccountId.Default(),
                amount: 1000000000n,
                expiration: undefined
            }
        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const allowanceLocalCache = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;

        LedgerWrapper.approveAllowance = jest.fn().mockResolvedValue(Promise.resolve());
        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data?.assetMetaData);
        subAccountBalanceHandler.handle = jest.fn().mockResolvedValue(test.data?.subAccountBalance);

        allowanceLocalCache.updateOrAddAllowance = jest.fn().mockReturnValue({});

        const updateAllowanceHandler = new UpdateAllowanceHandler(
            logger,
            identifierService,
            assetMetaDataHandler,
            allowanceLocalCache,
            subAccountBalanceHandler,
            mockAssetManagerConfiguration
        );

        const result = await updateAllowanceHandler.process(test.input);

        console.log(result);

        expect(result).toEqual(test.result);

    });
});