"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockLogger = void 0;
class MockLogger {
    log(message, params) {
    }
    logDebug(message, params) {
    }
    logInformation(message, params) {
    }
    logWarning(message, params) {
    }
    logError(error, message, params) {
    }
    logCritical(error, message, params) {
    }
}
exports.MockLogger = MockLogger;
describe("Logger Tests", () => {
    const logger = new MockLogger();
    it("test logger mock", async () => {
        jest.resetAllMocks();
        expect(logger).toEqual(new MockLogger());
    });
});
