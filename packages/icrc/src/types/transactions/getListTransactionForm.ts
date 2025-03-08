import { PageInfo } from "@ic-wallet-middleware/common";
import { SubAccountId } from "@icrc/types/assets";


export interface GetListTransactionForm {
    ledgerAddress: string;
    subAccountId?: SubAccountId;
    pageInfo: PageInfo;
}
