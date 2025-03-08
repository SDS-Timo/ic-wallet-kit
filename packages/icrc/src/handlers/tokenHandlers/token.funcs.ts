import { HandlerWrapper } from "@ic-wallet-kit/common";
import { GetAvailableAssetsHandler, GetTokenMarketHandler } from "@icrc/handlers";
import { GetTokenListForm, GetTokenMarketInfo } from "@icrc/types";

export const getAvailableAssets = async (form: GetTokenListForm) => {
    const result = await HandlerWrapper.callHandler(GetAvailableAssetsHandler, form);
    return result;
}

export const getTokenMarket = async (form: GetTokenMarketInfo) => {
    const result = await HandlerWrapper.callHandler(GetTokenMarketHandler, form);
    return result;
}
