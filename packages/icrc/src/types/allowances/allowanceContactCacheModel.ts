
export interface AllowanceContactCacheModel {
    ledgerAddress: string;
    subAccountId: string;
    senderPrincipal: string;
    amount: bigint;
    expiration?: bigint | undefined;
}
