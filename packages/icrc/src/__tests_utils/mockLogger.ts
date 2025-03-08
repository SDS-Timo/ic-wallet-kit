import { ILogger } from "@ic-wallet-kit/common";

export class MockLogger implements ILogger {
    log(message: string | undefined, params?: any[] | undefined): void {
        console.log("-------------log--------------");
        console.log(message);
        console.log(params);
    }
    logDebug(message: string | undefined, params?: any[] | undefined): void {
        console.log("-------------logDebug--------------");
        console.log(message);
        console.log(params);
    }
    logInformation(message: string | undefined, params?: any[] | undefined): void {
        console.log("-------------logInformation--------------");
        console.log(message);
        console.log(params);
    }
    logWarning(message: string | undefined, params?: any[] | undefined): void {
        console.log("-------------logWarning--------------");
        console.log(message);
        console.log(params);
    }

    logError(error: any, message?: string | undefined, params?: any[] | undefined): void {
        console.log("-------------logError--------------");
        console.log(message);
        console.log(error);
    }

    logCritical(error: any, message?: string | undefined, params?: any[] | undefined): void {
        console.log("-------------logCritical--------------");
        console.log(message);
        console.log(error);
    }

}
