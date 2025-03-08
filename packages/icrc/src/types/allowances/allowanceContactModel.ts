
export interface AllowanceContactModel {
    ledgerAddress: string;
    subAccount: string;
    sender: string;
    amount: bigint;
    expiration: string | undefined;
}
