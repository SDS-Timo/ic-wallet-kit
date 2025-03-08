import { IFormError } from "@common/forms/iFormError";
 
export const isFormErrorArray = (array: any[]): array is IFormError[] => {
    if (!Array.isArray(array)) {
        return false;
    }
    return array.every((x) => "fieldName" in x)
}