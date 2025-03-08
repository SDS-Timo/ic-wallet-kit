import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { GetTokenMarketCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { SubAccountId, TokenMarketInfo } from "@icrc/types";
import { GetSubAccountForm } from "@icrc/types/forms";

describe("GetSubAccountByHandler Process Tests", () => {
    const validForm: GetSubAccountForm = {
        ledgerAddress: "mock-ledger-address",
        subAccountId: SubAccountId.Default(),
        loadType: LoadType.Quick,
    };

    const tests: testDefinition[] = [
        {
            name: "GetSubAccountByHandler: Successfully processes sub-account",
            input: { ...validForm },
            data: {
                metadata: { symbol: "TEST", decimals: 8 },
                tokenMarket: {
                    isSuccess: true,
                    data: { markets: [{ symbol: "TEST", price: 100 } as TokenMarketInfo] },
                },
                balance: { balance: BigInt(1000), subAccountId: "mock-subAccountId" },
                result: {
                    subAccountId: "mock-subAccountId",
                    balance: BigInt(1000),
                    currencyAmount: "0.00001",
                    ledgerAddress: "mock-ledger-address",
                    name: "Test SubAccount",
                    isSync: true,
                    decimal: 8,
                },
            },
        },
        {
            name: "GetSubAccountByHandler: Handles missing token market data",
            input: { ...validForm },
            data: {
                metadata: { symbol: "TEST", decimals: 8 },
                tokenMarket: { isSuccess: false, data: undefined },
                balance: { balance: BigInt(500), subAccountId: "mock-subAccountId" },
                result: {
                    subAccountId: "mock-subAccountId",
                    balance: BigInt(500),
                    currencyAmount: "0.000005",
                    ledgerAddress: "mock-ledger-address",
                    name: "Test SubAccount",
                    isSync: true,
                    decimal: 8,
                },
            },
        },
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler>(<unknown>AssetMetaDataCacheHandler))() as jest.Mocked<AssetMetaDataCacheHandler>;
        const getTokenMarketCacheHandler = new (<new () => GetTokenMarketCacheHandler>(<unknown>GetTokenMarketCacheHandler))() as jest.Mocked<GetTokenMarketCacheHandler>;
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler>(<unknown>SubAccountBalanceHandler))() as jest.Mocked<SubAccountBalanceHandler>;

        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data.metadata);
        getTokenMarketCacheHandler.handle = jest.fn().mockResolvedValue(test.data.tokenMarket);
        subAccountBalanceHandler.handle = jest.fn().mockResolvedValue(test.data.balance);

        const handler = new GetSubAccountByHandler(
            logger,
            assetMetaDataHandler,
            subAccountBalanceHandler,
            getTokenMarketCacheHandler
        );

        handler["getSubAccountById"] = jest.fn().mockResolvedValue(test.data.result);

        const result = await handler.process(test.input);

        await handler.validate(test.input);

        expect(result).toEqual(test.data.result);

        expect(assetMetaDataHandler.handle).toHaveBeenCalledWith({
            ledgerAddress: test.input.ledgerAddress,
            loadType: test.input.loadType,
        });
        expect(getTokenMarketCacheHandler.handle).toHaveBeenCalledWith({
            loadType: test.input.loadType,
        });
        expect(handler["getSubAccountById"]).toHaveBeenCalledWith(
            test.input.subAccountId,
            test.input,
            test.data.tokenMarket.data?.markets[0],
            test.data.metadata.decimals
        );

    });
});
