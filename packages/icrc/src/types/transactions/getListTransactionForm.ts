import { PageInfo } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types/assets";


export interface GetListTransactionForm {
    ledgerAddress: string;
    subAccountId?: SubAccountId;
    pageInfo: PageInfo;
}
