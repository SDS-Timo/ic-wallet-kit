export declare class ValidationError extends Error {
    localizationKey: string;
    fieldName: string;
    constructor(localizationKey: string, fieldName: string, message: string);
}
