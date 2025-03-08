import { LoadType } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetAvailableAssetsHandler } from "@icrc/handlers";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { AssetRepository } from "@icrc/repositories";
import { GetTokenListForm } from "@icrc/types/tokens/getTokenListForm";

describe("GetAvailableAssetsHandler Process Tests", () => {
    const validForm: GetTokenListForm = {
        loadType: LoadType.Quick
    };

    const tests: testDefinition[] = [
        {
            name: "GetAvailableAssetsHandler: Returns only new tokens",
            input: { ...validForm },
            data: {
                assets: [{ ledgerAddress: "ledger-1" }],
                tokenList: [
                    { ledgerAddress: "ledger-2", tokenName: "Token 2" },
                    { ledgerAddress: "ledger-3", tokenName: "Token 3" },
                ],
            },
            result: {
                tokenList: [
                    { ledgerAddress: "ledger-2", tokenName: "Token 2" },
                    { ledgerAddress: "ledger-3", tokenName: "Token 3" },
                ],
            },
        },
        {
            name: "GetAvailableAssetsHandler: No new tokens to add",
            input: { ...validForm },
            data: {
                assets: [{ ledgerAddress: "ledger-1" }],
                tokenList: [{ ledgerAddress: "ledger-1", tokenName: "Token 1" }],
            },
            result: {
                tokenList: [],
            },
        },
        {
            name: "GetAvailableAssetsHandler: No new tokens to add 1",
            input: { ...validForm },
            data: {
                assets: [{ ledgerAddress: "ledger-1" }],
                tokenList: undefined,
            },
            result: {
                tokenList: [],
            },
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const getTokenSNSInternalHandler = new (<new () => GetTokenSNSCacheHandler><unknown>GetTokenSNSCacheHandler)() as jest.Mocked<GetTokenSNSCacheHandler>;

        assetRepository.getTokensOrDefault = jest.fn().mockResolvedValue(test.data?.assets ?? []);
        getTokenSNSInternalHandler.handle = jest.fn().mockResolvedValue({
            data: { TokenList: test.data?.tokenList },
        });

        const handler = new GetAvailableAssetsHandler(logger, assetRepository, getTokenSNSInternalHandler);

        await handler.validate(test.input);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(assetRepository.getTokensOrDefault).toHaveBeenCalled();
        expect(getTokenSNSInternalHandler.handle).toHaveBeenCalledWith({ loadType: test.input.loadType });
    });
});
