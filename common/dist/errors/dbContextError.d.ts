export declare class DbContextError extends Error {
    errorType: string;
    constructor(errorType: string, message: string);
}
