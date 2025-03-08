import { Operation } from "@icrc/types/transactions/operation";
import { RosettaTransactionIdentifier } from "@icrc/types/transactions/rosettaTransactionIdentifier";
import { RosettaTransactionMetadata } from "@icrc/types/transactions/rosettaTransactionMetadata";

export interface RosettaTransaction {
    metadata: RosettaTransactionMetadata;
    operations: Operation[];
    transaction_identifier: RosettaTransactionIdentifier;
}
