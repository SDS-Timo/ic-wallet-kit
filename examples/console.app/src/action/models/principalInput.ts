import { Principal } from "@dfinity/principal";
import { SubAccountId } from "@ic-wallet-middleware/icrc";

export class PrincipalInput {

    constructor(public principal?: Principal, public subAccount?: SubAccountId) {

    }

    public static Default(): PrincipalInput {
        return new PrincipalInput(Principal.anonymous(), SubAccountId.Default());
    }
}