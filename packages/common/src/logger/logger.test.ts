import { ILogger } from "@common/logger/logger";

export class MockLogger implements ILogger {
    log(message: string | undefined, params?: any[] | undefined): void {
    }
    logDebug(message: string | undefined, params?: any[] | undefined): void {
    }
    logInformation(message: string | undefined, params?: any[] | undefined): void {
    }
    logWarning(message: string | undefined, params?: any[] | undefined): void {
    }
    logError(error: any, message?: string | undefined, params?: any[] | undefined): void {
    }
    logCritical(error: any, message?: string | undefined, params?: any[] | undefined): void {
    }

}


describe("Logger Tests", () => {

    const logger = new MockLogger();
 

    it("test logger mock", async () => {

        jest.resetAllMocks();

        expect(logger).toEqual(new MockLogger());
    });

   
});