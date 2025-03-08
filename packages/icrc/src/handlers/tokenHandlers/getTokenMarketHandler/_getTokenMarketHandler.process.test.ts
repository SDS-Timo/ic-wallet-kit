import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetTokenMarketHandler } from "@icrc/handlers";
import { GetTokenMarketCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { GetTokenMarketInfo } from "@icrc/types/tokens/getTokenMarketInfo";

describe("GetTokenMarketHandler Process Tests", () => {
    const validForm: GetTokenMarketInfo = {
        loadType: LoadType.Quick,
    };

    const tests: testDefinition[] = [
        {
            name: "GetTokenMarketHandler: Returns market data successfully",
            input: { ...validForm },
            data: {
                markets: [
                    { token: "Token1", price: "100" },
                    { token: "Token2", price: "200" },
                ],
            },
            result: {
                markets: [
                    { token: "Token1", price: "100" },
                    { token: "Token2", price: "200" },
                ],
            },
        },
        {
            name: "GetTokenMarketHandler: No market data available",
            input: { ...validForm },
            data: {
                markets: [],
            },
            result: {
                markets: [],
            },
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const getTokenMarketCacheHandler = new (<new () => GetTokenMarketCacheHandler><unknown>GetTokenMarketCacheHandler)() as jest.Mocked<GetTokenMarketCacheHandler>;

        getTokenMarketCacheHandler.process = jest.fn().mockResolvedValue({
            markets: test.data?.markets ?? [],
        });

        const handler = new GetTokenMarketHandler(logger, getTokenMarketCacheHandler);
        await handler.validate(test.input)
        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(getTokenMarketCacheHandler.process).toHaveBeenCalledWith({
            loadType: test.input.loadType,
        });
    });
});
