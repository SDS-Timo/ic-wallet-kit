import { Principal } from "@dfinity/principal";

export interface AddHplVirtualAccountForm {
    virtualAccountName: string;
    assetId: bigint;
    accountId: bigint,
    accessByPrincipal: Principal,
    amount: bigint,
    expiration?: bigint
}