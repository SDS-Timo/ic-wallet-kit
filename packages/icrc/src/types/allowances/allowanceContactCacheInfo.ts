import { ILoadForce } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types/assets";

export interface AllowanceContactCacheInfo extends ILoadForce {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    senderPrincipal: string;
}
