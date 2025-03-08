import { getUSDfromToken } from "@ic-wallet-kit/common";
import { TokenMarketInfo } from "@icrc/types";

export const getCurrencyAmount = (tokenMarket: TokenMarketInfo | undefined, balance: bigint, decimals: number): string => {
    const result = tokenMarket ? getUSDfromToken(balance.toString(), tokenMarket.price, decimals) : "0.00";

    return result;
}