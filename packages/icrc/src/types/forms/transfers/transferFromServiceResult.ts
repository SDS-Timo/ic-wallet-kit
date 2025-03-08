export interface TransferFromServiceResult {
    servicePrincipal: string;
    ledgerAddress: string;
    credit: bigint;
    deposit: bigint;
}
