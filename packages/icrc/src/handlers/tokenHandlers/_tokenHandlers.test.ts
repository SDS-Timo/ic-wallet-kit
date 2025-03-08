import { HandlerWrapper } from "@ic-wallet-kit/common";
import { getAvailableAssets, GetAvailableAssetsHandler, getTokenMarket, GetTokenMarketHandler } from "@icrc/handlers";
import { GetTokenListForm, GetTokenMarketInfo } from "@icrc/types";

describe("Token Handlers", () => {
    it("getAvailableAssets calls handler and returns result", async () => {
        const mockForm: GetTokenListForm = { /* Mock form data */ } as any;
        const mockResult = { assets: [] };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getAvailableAssets(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetAvailableAssetsHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("getTokenMarket calls handler and returns result", async () => {
        const mockForm: GetTokenMarketInfo = { /* Mock form data */ } as any;
        const mockResult = { marketData: {} };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getTokenMarket(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetTokenMarketHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
