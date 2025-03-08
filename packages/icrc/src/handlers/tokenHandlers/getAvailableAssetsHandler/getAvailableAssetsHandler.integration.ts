import { FormResult, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { GetAvailableAssetsHandler } from "@icrc/handlers";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { AssetRepository } from "@icrc/repositories";

describe("Unit getAvailableAssetsHandler tests", () => {

    const testData =
        [
            {
                name: "getAvailableAssetsHandler any result",
                enable: true,
                data:
                {
                    input: {},
                    result: 0,
                    resultError: ""
                }
            }
        ];

    for (let test of testData) {

        if (test.enable) {

            it(test.name, async () => {

                const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
                const getTokenSNSInternalHandler = new (<new () => GetTokenSNSCacheHandler><unknown>GetTokenSNSCacheHandler)() as jest.Mocked<GetTokenSNSCacheHandler>;

                assetRepository.getTokensOrDefault = jest.fn().mockReturnValue([
                    {
                        sortOrder: 1,
                        indexAddress: "",
                        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai"
                    }
                ]);

                getTokenSNSInternalHandler.handle = jest.fn().mockReturnValue(FormResult.success({
                    TokenList: [
                        {
                            indexAddress: "",
                            ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai"
                        },
                        {
                            indexAddress: "",
                            ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai1"
                        },
                    ]
                }));

                let handler = new GetAvailableAssetsHandler(new MockLogger(), assetRepository, getTokenSNSInternalHandler);

                try {
                    const result = await handler.handle({ loadType: LoadType.Cache });
                    expect(test.data.result).toBeLessThan(result.data?.tokenList.length ?? 0);
                }
                catch (e: any) {
                    expect(e.message).toEqual(test.data.resultError);
                }
            });
        }
    }
});