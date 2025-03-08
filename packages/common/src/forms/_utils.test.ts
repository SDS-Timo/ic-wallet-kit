
import { IFormError } from "@common/forms/iFormError";
import { isFormErrorArray } from "@common/forms/utils";

describe("isFormErrorArray", () => {
    it("should return true for an array of IFormError objects", () => {
        const input: IFormError[] = [
            { fieldName: "name", message: "Name is required", localizationKey: "name.invalid" },
            { fieldName: "email", message: "Invalid email", localizationKey: "email.invalid" }
        ];
        expect(isFormErrorArray(input)).toBe(true);
    });

    it("should return true for an empty array", () => {
        expect(isFormErrorArray([])).toBe(true);
    });

    it("should return false for an array with non-IFormError objects", () => {
        const input = [
            { error: "Some error" },
            { field: "name", message: "Missing field" }
        ];
        expect(isFormErrorArray(input)).toBe(false);
    });

    it("should return false for a non-array value", () => {
        expect(isFormErrorArray(null as any)).toBe(false);
        expect(isFormErrorArray(undefined as any)).toBe(false);
        expect(isFormErrorArray(123 as any)).toBe(false);
        expect(isFormErrorArray("string" as any)).toBe(false);
        expect(isFormErrorArray({ fieldName: "name" } as any)).toBe(false);
    });
});