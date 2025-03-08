import { hexToNumber } from "@ic-wallet-middleware/common";
import { WalletSubAccount } from "@icrc/types/wallets/walletSubAccount";
import bigInt from "big-integer";


export function orderBySubAccountId(a: WalletSubAccount, b: WalletSubAccount) {
    return hexToNumber(a.subAccountId.toString())?.compare(hexToNumber(b.subAccountId.toString()) || bigInt()) || 0;
};