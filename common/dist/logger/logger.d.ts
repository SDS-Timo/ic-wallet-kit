export interface ILogger {
    log(message: string, params?: any[]): void;
    logDebug(message: string, params?: any[]): void;
    logInformation(message: string, params?: any[]): void;
    logWarning(message: string, params?: any[]): void;
    logError(error: any, message?: string, params?: any[]): void;
    logCritical(error: any, message?: string, params?: any[]): void;
}
