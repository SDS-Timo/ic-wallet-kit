import { OperationAmountCurrency } from "@icrc/types/transactions/operationAmountCurrency";

export interface OperationAmount {
    value: string;
    currency: OperationAmountCurrency;
    decimals: number;
}
