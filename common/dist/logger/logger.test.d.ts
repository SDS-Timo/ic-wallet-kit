import { ILogger } from "@common/logger/logger";
export declare class MockLogger implements ILogger {
    log(message: string | undefined, params?: any[] | undefined): void;
    logDebug(message: string | undefined, params?: any[] | undefined): void;
    logInformation(message: string | undefined, params?: any[] | undefined): void;
    logWarning(message: string | undefined, params?: any[] | undefined): void;
    logError(error: any, message?: string | undefined, params?: any[] | undefined): void;
    logCritical(error: any, message?: string | undefined, params?: any[] | undefined): void;
}
