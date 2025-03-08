import { ILoadForce } from "@ic-wallet-middleware/common";
import { SubAccountId } from "@icrc/types/assets";

export interface AllowanceContactCacheInfo extends ILoadForce {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    senderPrincipal: string;
}
