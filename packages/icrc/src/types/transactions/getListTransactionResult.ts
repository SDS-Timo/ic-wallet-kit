import { PageResult } from "@ic-wallet-middleware/common";
import { TransactionModel } from "@icrc/types/transactions/transactionModel";

export interface GetListTransactionResult {
    transactions: TransactionModel[];
    pageResult: PageResult;
}
