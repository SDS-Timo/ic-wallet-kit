import { allowanceCacheModelToDataModel, allowanceCacheToModel, allowanceFormToCache } from "@icrc/maps/allowanceMapper";
import { AllowanceCacheModel, AllowanceModel, SubAccountId } from "@icrc/types";
import { AllowanceDataModel } from "@icrc/types/allowances/allowanceDataModel";
import { CheckAllowanceForm } from "@icrc/types/forms";
import { convertBigIntToDateString } from "@icrc/utils/dateTimeUtils";


describe("Allowance Utility Functions", () => {
    const formatter = "YYYY-MM-DD";
    const mockDecimal = 8;

    describe("allowanceCacheToModel", () => {
        it("allowanceCacheToModel: should convert AllowanceCacheModel to AllowanceModel correctly", () => {
            const allowanceCache: AllowanceCacheModel = {
                amount: BigInt(1000),
                ledgerAddress: "mock-ledger-address",
                spenderPrincipal: "mock-principal",
                spenderSubId: "0x0",
                subAccountId: "0x1",
                expiration: BigInt(1672531200),
            };

            const expectedModel: AllowanceModel = {
                amount: BigInt(1000),
                ledgerAddress: "mock-ledger-address",
                spenderPrincipal: "mock-principal",
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.parseFromString("0x1"),
                expiration: convertBigIntToDateString(BigInt(1672531200), formatter),
                decimal: mockDecimal,
            };

            const result = allowanceCacheToModel(allowanceCache, mockDecimal, formatter);
            expect(result).toEqual(expectedModel);
        });
    });

    describe("allowanceFormToCache", () => {
        it("allowanceFormToCache: should convert CheckAllowanceForm to AllowanceCacheModel correctly", () => {
            const form: CheckAllowanceForm = {
                ledgerAddress: "mock-ledger-address",
                spenderPrincipal: "mock-principal",
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.parseFromString("0x1"),
            };

            const amount = BigInt(500);
            const expiration = BigInt(1672531200);

            const expectedCache: AllowanceCacheModel = {
                amount: amount,
                ledgerAddress: "mock-ledger-address",
                spenderPrincipal: "mock-principal",
                spenderSubId: "0x0",
                subAccountId: "0x1",
                expiration: expiration,
            };

            const result = allowanceFormToCache(form, amount, expiration);
            expect(result).toEqual(expectedCache);
        });
    });

    describe("allowanceCacheModelToDataModel", () => {
        it("allowanceCacheModelToDataModel: should convert AllowanceCacheModel to AllowanceDataModel correctly", () => {
            const allowanceCache: AllowanceCacheModel = {
                amount: BigInt(1500),
                ledgerAddress: "mock-ledger-address",
                spenderPrincipal: "mock-principal",
                spenderSubId: "0x2",
                subAccountId: "0x3",
                expiration: BigInt(1672531200),
            };

            const expectedDataModel: AllowanceDataModel = {
                amount: BigInt(1500),
                ledgerAddress: "mock-ledger-address",
                spenderPrincipal: "mock-principal",
                spenderSubId: SubAccountId.parseFromString("0x2"),
                subAccountId: SubAccountId.parseFromString("0x3"),
                expiration: BigInt(1672531200),
            };

            const result = allowanceCacheModelToDataModel(allowanceCache);
            expect(result).toEqual(expectedDataModel);
        });
    });
});
