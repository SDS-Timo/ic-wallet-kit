import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AssetTransactionFeeCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetTransactionFeeCacheHandler/assetTransactionFeeCacheHandler";
import { GetTokenMarketCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { LoadAssetHandler } from "@icrc/internalHandlers/loadAssetHandler/loadAssetHandler";
import { AssetSubAccountView, SubAccountId, TokenMarketInfo } from "@icrc/types";
import { LoadAssetForm } from "@icrc/types/forms/assets/loadAssetForm";


describe("LoadAssetHandler Process Tests", () => {
    const validForm: LoadAssetForm = {
        ledgerAddress: "mock-ledger-address",
        indexAddress: "mock-index-address",
        subAccounts: [SubAccountId.parseFromNumber(1), SubAccountId.parseFromNumber(2)],
        loadType: LoadType.Quick,
    };

    const tests: testDefinition[] = [
        {
            name: "LoadAssetHandler: Successfully loads asset",
            input: { ...validForm },
            data: {
                metadata: {
                    symbol: "TEST",
                    name: "Test Token",
                    decimals: 8,
                    logo: "mock-logo-url",
                },
                transactionFee: { transactionFee: BigInt(100) },
                tokenMarket: {
                    isSuccess: true,
                    data: { markets: [{ symbol: "TEST", price: 100 } as TokenMarketInfo] },
                },
                subAccounts: [
                    {
                        subAccountId: SubAccountId.parseFromNumber(1),
                        balance: BigInt(1000),
                        currencyAmount: "0.00001",
                        isSync: true,
                    } as AssetSubAccountView,
                    {
                        subAccountId: SubAccountId.parseFromNumber(2),
                        balance: BigInt(2000),
                        currencyAmount: "0.00002",
                        isSync: true,
                    } as AssetSubAccountView,
                ],
            },
            result: {
                ledgerAddress: "mock-ledger-address",
                indexAddress: "mock-index-address",
                tokenSymbol: "TEST",
                tokenName: "Test Token",
                decimal: 8,
                logo: "mock-logo-url",
                transactionFee: BigInt(100),
                isSync: true,
                subAccounts: [
                    {
                        subAccountId: SubAccountId.parseFromNumber(1),
                        balance: BigInt(1000),
                        currencyAmount: "0.00001",
                        isSync: true,
                    },
                    {
                        subAccountId: SubAccountId.parseFromNumber(2),
                        balance: BigInt(2000),
                        currencyAmount: "0.00002",
                        isSync: true,
                    },
                ],
            },
        },
    ];


    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler>(<unknown>AssetMetaDataCacheHandler))() as jest.Mocked<AssetMetaDataCacheHandler>;
        const assetTransactionFeeHandler = new (<new () => AssetTransactionFeeCacheHandler>(<unknown>AssetTransactionFeeCacheHandler))() as jest.Mocked<AssetTransactionFeeCacheHandler>;
        const getTokenMarketCacheHandler = new (<new () => GetTokenMarketCacheHandler>(<unknown>GetTokenMarketCacheHandler))() as jest.Mocked<GetTokenMarketCacheHandler>;
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler>(<unknown>SubAccountBalanceHandler))() as jest.Mocked<SubAccountBalanceHandler>;

        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data?.metadata);
        assetTransactionFeeHandler.handle = jest.fn().mockResolvedValue(test.data?.transactionFee);
        getTokenMarketCacheHandler.handle = jest.fn().mockResolvedValue(test.data?.tokenMarket);

        const handler = new LoadAssetHandler(
            logger,
            assetMetaDataHandler,
            assetTransactionFeeHandler,
            subAccountBalanceHandler,
            getTokenMarketCacheHandler
        );

        handler["getSubAccountById"] = jest.fn()
            .mockResolvedValueOnce(test.data.subAccounts[0])
            .mockResolvedValueOnce(test.data.subAccounts[1]);

        await handler.validate(test.input);

        const result = await handler.process(test.input);

        expect(result).toEqual(test.result);

        expect(assetMetaDataHandler.handle).toHaveBeenCalledWith({
            ledgerAddress: test.input.ledgerAddress,
            indexAddress: test.input.indexAddress,
            loadType: test.input.loadType,
        });

        expect(assetTransactionFeeHandler.handle).toHaveBeenCalledWith({
            ledgerAddress: test.input.ledgerAddress,
            indexAddress: test.input.indexAddress,
            loadType: test.input.loadType,
        });

        expect(getTokenMarketCacheHandler.handle).toHaveBeenCalledWith({
            loadType: test.input.loadType,
        });

        expect(handler["getSubAccountById"]).toHaveBeenCalledTimes(2);
        expect(handler["getSubAccountById"]).toHaveBeenCalledWith(
            SubAccountId.parseFromNumber(1),
            test.input,
            test.data.tokenMarket.data?.markets[0],
            test.data.metadata.decimals
        );
        expect(handler["getSubAccountById"]).toHaveBeenCalledWith(
            SubAccountId.parseFromNumber(2),
            test.input,
            test.data.tokenMarket.data?.markets[0],
            test.data.metadata.decimals
        );
    });
});
