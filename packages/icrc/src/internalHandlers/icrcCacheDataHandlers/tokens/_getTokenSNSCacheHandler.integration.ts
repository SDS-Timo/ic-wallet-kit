import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { TokenLocalCache } from "@icrc/repositories";
import { CkERC20Wrapper } from "@icrc/wrappers/ckERC20/ckERC20Wrapper";
import { ManualTokenWrapper } from "@icrc/wrappers/default/manualTokenWrapper";
import { SnsWrapper } from "@icrc/wrappers/SNSs/snsWrapper";

describe("Unit getTokenInternalHandler tests", () => {

    const testData =
        [
            {
                name: "getTokenInternalHandler any result",
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

                const tokenCacheRepository = new (<new () => TokenLocalCache><unknown>TokenLocalCache)() as jest.Mocked<TokenLocalCache>;
                const snsWrapper = new (<new () => SnsWrapper><unknown>SnsWrapper)() as jest.Mocked<SnsWrapper>;

                const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;

                identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
                identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))

                const ckERC20Wrapper = new CkERC20Wrapper(new MockLogger(), identifierService);

                const manualTokenWrapper = new ManualTokenWrapper(new MockLogger(), identifierService);

                tokenCacheRepository.getTokens = jest.fn().mockReturnValue([]);
                tokenCacheRepository.setTokens = jest.fn().mockImplementation(() => { });

                let handler = new GetTokenSNSCacheHandler(new MockLogger(), tokenCacheRepository, identifierService, snsWrapper, ckERC20Wrapper, manualTokenWrapper);

                try {
                    const result = await handler.handle({ loadType: LoadType.Cache });
                    expect(test.data.result).toBeLessThan(result.data?.TokenList.length ?? 0);
                }
                catch (e: any) {
                    expect(e.message).toEqual(test.data.resultError);
                }
            });
        }
    }
});