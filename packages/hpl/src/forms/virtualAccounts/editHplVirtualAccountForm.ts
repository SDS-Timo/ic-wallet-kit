export interface EditHplVirtualAccountForm {
    virtualAccountId: bigint;
    virtualAccountName: string;
    accountId: bigint,
    amount: bigint,
    expiration?: bigint
}