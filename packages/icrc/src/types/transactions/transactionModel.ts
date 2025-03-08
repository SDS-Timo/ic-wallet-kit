import { SubAccountId } from "@icrc/types/assets";
import { OperationStatusEnum, TransactionTypeEnum } from "@icrc/types/enums";

export interface TransactionModel {
    idx: string;
    hash: string;
    timestamp: number;
    from: string;
    fromSub: SubAccountId;
    to: string;
    toSub: SubAccountId;
    fee: bigint;
    amount: bigint;
    canisterId: string;
    status: OperationStatusEnum;
    type: TransactionTypeEnum;
    symbol: string;
    identityTo: string;
    identityFrom: string;
    kind: string;
}
