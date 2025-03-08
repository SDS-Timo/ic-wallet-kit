import { PageInfo } from "@ic-wallet-middleware/common";
import { SubAccountId } from "@icrc/types/assets";

export interface AssetTransactionInfo {
    indexAsset: string;
    symbol: string;
    subAccountIds: SubAccountId[];
    pageInfo: PageInfo
}
