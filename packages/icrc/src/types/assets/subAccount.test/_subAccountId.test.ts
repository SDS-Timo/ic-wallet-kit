import { Principal } from "@dfinity/principal";
import { hexToUint8Array } from "@ic-wallet-kit/common";
import { SubAccountIdError } from "@icrc/errors";
import { SubAccountId } from "@icrc/types/assets/subAccountId";

describe("SubAccountId Tests", () => {
    const validHex = "0x1a2b3c";
    const validNumber = 123456;
    const invalidHex = "0xGHIJK";
    const invalidNumber = -5;

    it("SubAccountId: toUint8Array converts hex to Uint8Array", () => {
        const subAccountId = SubAccountId.parseFromString(validHex);
        expect(subAccountId.toUint8Array()).toEqual(hexToUint8Array(validHex));
    });

    it("SubAccountId: toString returns the correct hex string", () => {
        const subAccountId = SubAccountId.parseFromString(validHex);
        expect(subAccountId.toString()).toBe(validHex);
    });

    it("SubAccountId: toNumber converts hex to number", () => {
        const subAccountId = SubAccountId.parseFromString("0x1A");
        expect(subAccountId.toNumber()).toBe(26);
    });

    it("SubAccountId: toPrincipal converts hex to Principal", () => {
        const subAccountId = SubAccountId.parseFromString("0x123456");
        expect(subAccountId.toPrincipal()).toBeInstanceOf(Principal);
    });

    it("SubAccountId: equals returns true for matching subAccount", () => {
        const sub1 = SubAccountId.parseFromString(validHex);
        const sub2 = SubAccountId.parseFromString(validHex);
        expect(sub1.equals(sub2)).toBe(true);
    });

    it("SubAccountId: notEquals returns true for different subAccount", () => {
        const sub1 = SubAccountId.parseFromString("0x1");
        const sub2 = SubAccountId.parseFromString("0x2");
        expect(sub1.notEquals(sub2)).toBe(true);
    });

    it("SubAccountId: parseFromUint8Array correctly parses Uint8Array", () => {
        const uint8Array = hexToUint8Array(validHex);
        const subAccountId = SubAccountId.parseFromUint8Array(uint8Array);
        expect(subAccountId.toString()).toBe(validHex);
    });

    it("SubAccountId: parseFromNumber correctly parses number", () => {
        const subAccountId = SubAccountId.parseFromNumber(validNumber);
        expect(subAccountId.toString()).toBe(`0x${validNumber.toString(16)}`);
    });

    it("SubAccountId: parseFromNumber throws error for invalid number", () => {
        expect(() => SubAccountId.parseFromNumber(invalidNumber)).toThrow(SubAccountIdError);
    });

    it("SubAccountId: Default returns the default SubAccountId", () => {
        const subAccountId = SubAccountId.Default();
        expect(subAccountId.toString()).toBe("0x0");
    });

    it("SubAccountId: tryParseFromNumber returns undefined for invalid number", () => {
        expect(SubAccountId.tryParseFromNumber(invalidNumber)).toBeUndefined();
    });

    it("SubAccountId: parseFromString correctly parses valid hex string", () => {
        const subAccountId = SubAccountId.parseFromString(validHex);
        expect(subAccountId.toString()).toBe(validHex);
    });

    it("SubAccountId: parseFromString throws error for invalid hex format", () => {
        expect(() => SubAccountId.parseFromString(invalidHex)).toThrow(SubAccountIdError);
    });

    it("SubAccountId: tryParseFromString returns undefined for invalid string", () => {
        expect(SubAccountId.tryParseFromString(invalidHex)).toBeUndefined();
    });

    it("SubAccountId: tryParseFromString returns undefined for undefined input", () => {
        expect(SubAccountId.tryParseFromString(undefined)).toBeUndefined();
    });
});
