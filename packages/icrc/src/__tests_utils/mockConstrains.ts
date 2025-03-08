import { Principal } from "@dfinity/principal";

export const mockAssetManagerConfiguration = { defaultDateTimeFormat: "MM/DD/YYYY HH:mm" };

export function mockSpenderPrincipal() {
    return Principal.fromHex("0x10");
}

export function mockSpenderPrincipalString() {
    return mockSpenderPrincipal().toText();
}

export function mockOwnerPrincipal() {
    return Principal.fromHex("0x33");
}

export function mockOwnerPrincipalString() {
    return mockOwnerPrincipal().toText();
}

export function mockReceiverPrincipal() {
    return Principal.fromHex("0x55");
}

export const mockPrincipal = Principal.fromHex("0x225").toString();
export const mockLedgerAddress = "test-ledger-address";
export const mockIndexAddress = "zlaol-iaaaa-aaaaq-aaaha-cai";