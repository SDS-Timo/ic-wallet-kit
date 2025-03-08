import { decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { SubAccountId } from "@icrc/types";

export class PrincipalProvider {

    static toAccountIdentifier(principal: Principal, subAccountId: SubAccountId): string {
        return encodeIcrcAccount({
            owner: principal,
            subaccount: subAccountId.toUint8Array()
        });
    }

    static toPrincipalAndSubAccountId(accountIdentifier: string): { owner: Principal, subaccount: SubAccountId } {
        const account = decodeIcrcAccount(accountIdentifier);
        return {
            owner: account.owner,
            subaccount: account.subaccount ? SubAccountId.parseFromUint8Array(account.subaccount as Uint8Array) : SubAccountId.Default()
        }
    }

    static toSubAccountId(principal: Principal): SubAccountId {
        const hex = principal.toHex().toLowerCase();
        const length = principal.toUint8Array().length.toString(16);
        const result = SubAccountId.parseFromString(`0x${length}${hex}`);
        return result;
    }

}
