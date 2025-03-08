import { Principal } from "@dfinity/principal";
import { hexToUint8Array } from "@ic-wallet-kit/common";
import { SubAccountIdError } from "@icrc/errors";

export class SubAccountId {
    private _subAccount: string;
    private constructor(subAccount: string) {
        this._subAccount = subAccount;
    }

    toUint8Array(): Uint8Array {
        return hexToUint8Array(this._subAccount);
    }

    toString(): string {
        return this._subAccount;
    }

    toNumber(): number {
        return parseInt(this._subAccount, 16);
    };

    toPrincipal(): Principal {
        return Principal.fromHex(this._subAccount.substring(2));
    };

    equals(subAccountId: SubAccountId) {
        return this._subAccount === subAccountId._subAccount
    }

    notEquals(subAccountId: SubAccountId) {
        return !this.equals(subAccountId);
    }

    public static parseFromUint8Array(uint8Array: Uint8Array) {
        const str = Buffer.from(uint8Array.buffer).toString('hex').replace(/^0+/, "").trim();
        if (!str) {
            return new SubAccountId("0x0");
        }
        else {
            return new SubAccountId(`0x${str}`);
        }
    }

    public static parseFromNumber(number: number): SubAccountId {
        if (number >= 0 && Number.isInteger(number)) {
            const subAccountStr = `0x${number.toString(16)}`;
            return new SubAccountId(subAccountStr);
        }
        throw new SubAccountIdError("Invalid subAccount value");
    }

    public static Default(): SubAccountId {
        return SubAccountId.parseFromString("0x0");
    }

    public static tryParseFromNumber(number: number): SubAccountId | undefined {
        try {
            return SubAccountId.parseFromNumber(number);
        }
        catch {
            return undefined;
        }

    }

    public static parseFromString(hexString: string): SubAccountId {
        if (/^0x[a-fA-F0-9]+$/.test(hexString)) {
            let hex = hexString.substring(2);
            if (hex.indexOf("0") === 0) {
                hex = hex.replace(/^0+/, "");
                if (hex == "") {
                    hex = "0";
                }
                hexString = `0x${hex}`;
            }
            return new SubAccountId(hexString);
        }
        throw new SubAccountIdError("Invalid subAccount format, expected 0xHEX");
    }

    public static tryParseFromString(hexString: string | undefined): SubAccountId | undefined {
        if (!hexString) {
            return undefined;
        }

        try {
            return SubAccountId.parseFromString(hexString);
        }
        catch {
            return undefined;
        }
    }
}
