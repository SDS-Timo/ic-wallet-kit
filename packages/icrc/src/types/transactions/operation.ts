import { OperationStatusEnum, OperationTypeEnum } from "@icrc/types/enums";
import { OperationAccount } from "@icrc/types/transactions/operationAccount";
import { OperationAmount } from "@icrc/types/transactions/operationAmount";
import { OperationIdentifier } from "@icrc/types/transactions/operationIdentifier";



export interface Operation {
    account: OperationAccount;
    amount: OperationAmount;
    operation_identifier: OperationIdentifier;
    status: OperationStatusEnum;
    type: OperationTypeEnum;
}
