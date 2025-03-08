import { LoadType } from "@ic-wallet-middleware/common";
import { mockIndexAddress, mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { GetTokenInfo, GetTokenResult, GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { TokenLocalCache } from "@icrc/repositories";
import { SupportedStandardEnum } from "@icrc/types";


import { SnsWrapper } from "@icrc/wrappers/SNSs/snsWrapper";
import { CkERC20Wrapper } from "@icrc/wrappers/ckERC20/ckERC20Wrapper";
import { ManualTokenWrapper } from "@icrc/wrappers/default/manualTokenWrapper";
import { IcrcLedgerServiceWrapper } from "@icrc/wrappers/icrc/icrcLedgerServiceWrapper/icrcLedgerServiceWrapper";

describe("GetTokenSNSCacheHandler Tests", () => {
    const validInfo: GetTokenInfo = { loadType: LoadType.Cache };
    const validResult: GetTokenResult = {
        TokenList: [
            {
                ledgerAddress: mockLedgerAddress,
                symbol: "TKN1",
                decimal: 8,
                indexAddress: mockIndexAddress,
                logo: "",
                name: "name1",
                supportedStandard: [SupportedStandardEnum.ICRC1]
            },
            {
                ledgerAddress: "ledgerAddress2",
                symbol: "TKN1",
                decimal: 8,
                indexAddress: "indexAddress2",
                logo: "",
                name: "name2",
                supportedStandard: [SupportedStandardEnum.ICRC2]
            },
        ],
    };

    let logger: MockLogger;
    let tokenCacheRepository: jest.Mocked<TokenLocalCache>;
    let identifierService: ReturnType<typeof mockAnonymousIdentifierService>;
    let snsWrapper: jest.Mocked<SnsWrapper>;
    let ckERC20Wrapper: jest.Mocked<CkERC20Wrapper>;
    let manualTokenWrapper: jest.Mocked<ManualTokenWrapper>;
    let icrcLedgerServiceWrapper: jest.Mocked<IcrcLedgerServiceWrapper>;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        tokenCacheRepository = new (<new () => TokenLocalCache><unknown>TokenLocalCache)() as jest.Mocked<TokenLocalCache>;
        snsWrapper = new (<new () => SnsWrapper><unknown>SnsWrapper)() as jest.Mocked<SnsWrapper>;
        ckERC20Wrapper = new (<new () => CkERC20Wrapper><unknown>CkERC20Wrapper)() as jest.Mocked<CkERC20Wrapper>;
        manualTokenWrapper = new (<new () => ManualTokenWrapper><unknown>ManualTokenWrapper)() as jest.Mocked<ManualTokenWrapper>;
        icrcLedgerServiceWrapper = new (<new () => IcrcLedgerServiceWrapper><unknown>IcrcLedgerServiceWrapper)() as jest.Mocked<IcrcLedgerServiceWrapper>;

        jest.clearAllMocks();
    });

    it("GetTokenSNSCacheHandler:getCacheDataError - should return the correct CacheDataError object", () => {
        const handler = new GetTokenSNSCacheHandler(logger, tokenCacheRepository, identifierService, snsWrapper, ckERC20Wrapper, manualTokenWrapper);
        const error = handler.getCacheDataError(validInfo);

        expect(error.errorType).toBe("tokens.unavailable");
        expect(error.message).toBe("Token unavailable");
    });

    it("GetTokenSNSCacheHandler:getLoadForceType - should return the correct load force type", async () => {
        const handler = new GetTokenSNSCacheHandler(logger, tokenCacheRepository, identifierService, snsWrapper, ckERC20Wrapper, manualTokenWrapper);
        await handler.validate(validInfo);

        const forceTypes = handler.getLoadForceType();
        expect(forceTypes).toEqual([LoadType.Full]);
    });

    it("GetTokenSNSCacheHandler:getLocalCacheData - should return tokens from the local cache if available", async () => {
        tokenCacheRepository.getTokens = jest.fn().mockResolvedValue(validResult.TokenList);

        const handler = new GetTokenSNSCacheHandler(logger, tokenCacheRepository, identifierService, snsWrapper, ckERC20Wrapper, manualTokenWrapper);
        const result = await handler.getLocalCacheData(validInfo);

        expect(result).toEqual(validResult);
    });

    it("GetTokenSNSCacheHandler:getLocalCacheData - should return undefined if no tokens are found in the local cache", async () => {
        tokenCacheRepository.getTokens = jest.fn().mockResolvedValue([]);

        const handler = new GetTokenSNSCacheHandler(logger, tokenCacheRepository, identifierService, snsWrapper, ckERC20Wrapper, manualTokenWrapper);
        const result = await handler.getLocalCacheData(validInfo);

        expect(result).toBeUndefined();
    });

    it("GetTokenSNSCacheHandler:getExternalData - should fetch and merge tokens from SNS, ckERC20, and manual wrappers", async () => {
        snsWrapper.getSNSTokens = jest.fn().mockResolvedValue([{ ledgerAddress: "address1", symbol: "TKN1" }]);
        ckERC20Wrapper.getCkERC20Tokens = jest.fn().mockResolvedValue([{ ledgerAddress: "address2", symbol: "TKN2" }]);
        manualTokenWrapper.getTokens = jest.fn().mockResolvedValue(
            [
                { ledgerAddress: "address3", symbol: "TKN3" },
                { ledgerAddress: "address11", symbol: "TKN1" }
            ]);

        IcrcLedgerServiceWrapper.create = jest.fn().mockReturnValue(icrcLedgerServiceWrapper);

        icrcLedgerServiceWrapper.getICRCSupportedStandards = jest.fn().mockResolvedValue([SupportedStandardEnum.ICRC1]);

        const handler = new GetTokenSNSCacheHandler(logger, tokenCacheRepository, identifierService, snsWrapper, ckERC20Wrapper, manualTokenWrapper);
        const result = await handler.getExternalData(validInfo);

        expect(snsWrapper.getSNSTokens).toHaveBeenCalled();
        expect(ckERC20Wrapper.getCkERC20Tokens).toHaveBeenCalled();
        expect(manualTokenWrapper.getTokens).toHaveBeenCalled();

        expect(result.TokenList.length).toBe(3);
        expect(result.TokenList[0].ledgerAddress).toBe("address11");
        expect(result.TokenList[0].symbol).toBe("TKN1");
        expect(result.TokenList[0].supportedStandard).toEqual([SupportedStandardEnum.ICRC1]);
    });

    it("GetTokenSNSCacheHandler:updateField - should update the token list in the local cache", async () => {
        tokenCacheRepository.setTokens = jest.fn();

        const handler = new GetTokenSNSCacheHandler(logger, tokenCacheRepository, identifierService, snsWrapper, ckERC20Wrapper, manualTokenWrapper);
        await handler.updateField(validInfo, validResult);

        expect(tokenCacheRepository.setTokens).toHaveBeenCalledWith(validResult.TokenList);
    });
});
