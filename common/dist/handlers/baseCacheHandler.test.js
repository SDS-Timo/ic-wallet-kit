"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@common/errors");
const forms_1 = require("@common/forms");
const baseCacheHandler_1 = require("@common/handlers/baseCacheHandler");
const logger_test_1 = require("@common/logger/logger.test");
class MockBaseHandler extends baseCacheHandler_1.BaseCacheDataHandler {
    getCacheDataError(info) {
        throw new Error("getCacheDataError not implemented.");
    }
    updateField(info, data) {
        throw new Error("updateField not implemented.");
    }
    getLocalCacheData(info) {
        throw new Error("getLocalCacheData not implemented.");
    }
    getIcrcData(info) {
        throw new Error("getIcrcData not implemented.");
    }
    validate(info) {
        throw new Error("validate not implemented.");
    }
    processError(error) {
        return [];
    }
}
describe("Unit BaseHandler handle Tests", () => {
    const logger = new logger_test_1.MockLogger();
    const handlerMock = new MockBaseHandler(logger);
    it("test process, force = false, getLocalCacheData return data", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.success("result");
        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        const info = {
            force: false,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test process, force = false, getLocalCacheData return undefined, getIcrcData retutn data", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.success("result");
        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve(undefined));
        handlerMock.getIcrcData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.updateField = jest.fn().mockReturnValue(undefined);
        const info = {
            force: false,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test process, force = false, getLocalCacheData return undefined, getIcrcData failed", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.error([
            {
                localizationKey: "default.error.message",
                fieldName: "",
                message: "Unavailable"
            }
        ]);
        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve(undefined));
        handlerMock.getIcrcData = jest.fn().mockImplementation(() => {
            throw new Error("fetch failed");
        });
        handlerMock.getCacheDataError = jest.fn().mockImplementation(() => {
            return new errors_1.CacheDataError("default.error.message", "Unavailable");
        });
        handlerMock.updateField = jest.fn().mockReturnValue(undefined);
        const info = {
            force: false,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test process, force = true", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.success("result");
        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getIcrcData = jest.fn().mockReturnValue(Promise.resolve("result"));
        const info = {
            force: true,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test process, force = true, getIcrcData failed", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.success("result");
        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.getIcrcData = jest.fn().mockImplementation(() => {
            throw new Error("fetch failed");
        });
        const info = {
            force: true,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test process, force = true, getIcrcData failed,getLocalCacheData return undefined", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.error([
            {
                localizationKey: "unexpected.error.message",
                fieldName: "",
                message: "\"Error\""
            }
        ]);
        ;
        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve(undefined));
        handlerMock.getIcrcData = jest.fn().mockReturnValue(Promise.reject("Error"));
        const info = {
            force: true,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test validation error", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.error([
            {
                localizationKey: "asset.not.found",
                fieldName: "assetAddress",
                message: "Asset Not Found"
            }
        ]);
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.getIcrcData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.validate = jest.fn().mockImplementation(() => {
            throw new errors_1.ValidationError("asset.not.found", "assetAddress", "Asset Not Found");
        });
        const info = {
            force: false,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test error", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.error([
            {
                message: "Message 1",
                fieldName: "",
                localizationKey: "default.error.message"
            }
        ]);
        handlerMock.validate = jest.fn().mockImplementation(() => {
            throw new Error("Message 1");
        });
        const info = {
            force: false,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test Promise.reject null error", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.error([
            {
                localizationKey: "unexpected.error.message",
                message: "undefined",
                fieldName: "",
            }
        ]);
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.getIcrcData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.validate = jest.fn().mockReturnValue(Promise.reject());
        const info = {
            force: false,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
    it("test Promise.reject error", async () => {
        jest.resetAllMocks();
        const expectedResult = forms_1.FormResult.error([
            {
                localizationKey: "unexpected.error.message",
                message: "\"testError\"",
                fieldName: "",
            }
        ]);
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.getIcrcData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.validate = jest.fn().mockReturnValue(Promise.reject("testError"));
        const info = {
            force: false,
        };
        const result = await handlerMock.handle(info);
        expect(result).toEqual(expectedResult);
    });
});
