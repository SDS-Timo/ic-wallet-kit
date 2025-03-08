import { ILoadForce } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types/assets";

export interface AllowanceCacheInfo extends ILoadForce {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
}
