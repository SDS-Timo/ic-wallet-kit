
export interface AllowanceCacheModel {
    ledgerAddress: string;
    subAccountId: string;
    spenderPrincipal: string;
    spenderSubId: string;
    amount: bigint;
    expiration?: bigint | undefined;
}
