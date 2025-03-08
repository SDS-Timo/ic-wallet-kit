import { CacheDataError, ValidationError } from "@common/errors";
import { FormResult } from "@common/forms";
import { BaseCacheDataHandler, IInfo, LoadType } from "@common/handlers/baseCacheHandler";
import { MockLogger } from "@common/logger/logger.test";

interface FakeInfo extends IInfo {
}
interface FakeResult {
}

class MockBaseHandler extends BaseCacheDataHandler<FakeInfo, FakeResult> {
    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }
    getCacheDataError(info: FakeInfo): CacheDataError {
        throw new Error("getCacheDataError not implemented.");
    }

    updateField(info: FakeInfo, data: any): void {
        throw new Error("updateField not implemented.");
    }

    getLocalCacheData(info: FakeInfo): Promise<FakeResult> {
        throw new Error("getLocalCacheData not implemented.");
    }
    getExternalData(info: FakeInfo): Promise<FakeResult> {
        throw new Error("getExternalData not implemented.");
    }

    validate(info: FakeInfo): Promise<void> {
        throw new Error("validate not implemented.");
    }


}

describe("Unit BaseHandler handle Tests", () => {

    const logger = new MockLogger();
    const handlerMock = new MockBaseHandler(logger);

    it("test process, force = false, getLocalCacheData return data", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.success("result");

        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));

        const info: FakeInfo = {
            loadType: LoadType.Cache
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);
    });

    it("test process, force = false, getLocalCacheData return undefined, getExternalData retutn data", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.success("result");

        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve(undefined))
        handlerMock.getExternalData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.updateField = jest.fn().mockReturnValue(undefined);

        const info: FakeInfo = {
            loadType: LoadType.Cache
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);
    });

    it("test process, force = false, getLocalCacheData return undefined, getExternalData failed", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.error([
            {
                localizationKey: "default.error.message",
                fieldName: "",
                message: "Unavailable"
            }]);

        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve(undefined));
        handlerMock.getExternalData = jest.fn().mockImplementation(() => {
            throw new Error("fetch failed");
        });
        handlerMock.getCacheDataError = jest.fn().mockImplementation(() => {
            return new CacheDataError("default.error.message",
                "Unavailable");
        });

        handlerMock.updateField = jest.fn().mockReturnValue(undefined);

        const info: FakeInfo = {
            loadType: LoadType.Cache
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);
    });

    it("test process, force = true", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.success("result");

        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getExternalData = jest.fn().mockReturnValue(Promise.resolve("result"));

        const info: FakeInfo = {
            loadType: LoadType.Full
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);
    });

    it("test process, force = true, getExternalData failed", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.success("result");

        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.getExternalData = jest.fn().mockImplementation(() => {
            throw new Error("fetch failed");
        })

        const info: FakeInfo = {
            loadType: LoadType.Full
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);
    });

    it("test process, force = true, getExternalData failed,getLocalCacheData return undefined", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.error([
            {
                localizationKey: "unexpected.error.message",
                fieldName: "",
                message: "\"Error\""
            }]);;

        handlerMock.validate = jest.fn().mockReturnValue(Promise.resolve());
        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve(undefined));
        handlerMock.getExternalData = jest.fn().mockReturnValue(Promise.reject("Error"))

        const info: FakeInfo = {
            loadType: LoadType.Full
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);
    });

    it("test validation error", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.error([
            {
                localizationKey: "asset.not.found",
                fieldName: "ledgerAddress",
                message: "Asset Not Found"
            }
        ]);

        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.getExternalData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.validate = jest.fn().mockImplementation(() => {
            throw new ValidationError("asset.not.found", "ledgerAddress", "Asset Not Found");
        });
        const info: FakeInfo = {
            loadType: LoadType.Cache
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);

    });

    it("test error", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.error([
            {
                message: "Message 1",
                fieldName: "",
                localizationKey: "default.error.message"
            }
        ]);

        handlerMock.validate = jest.fn().mockImplementation(() => {
            throw new Error("Message 1");
        });
        const info: FakeInfo = {
            loadType: LoadType.Cache
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);

    });

    it("test Promise.reject null error", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.error([
            {
                localizationKey: "unexpected.error.message",
                message: "undefined",
                fieldName: "",
            }
        ]);

        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.getExternalData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.validate = jest.fn().mockReturnValue(Promise.reject());
        const info: FakeInfo = {
            loadType: LoadType.Cache
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);

    });

    it("test Promise.reject error", async () => {

        jest.resetAllMocks();

        const expectedResult = FormResult.error([
            {
                localizationKey: "unexpected.error.message",
                message: "\"testError\"",
                fieldName: "",
            }
        ]);

        handlerMock.getLocalCacheData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.getExternalData = jest.fn().mockReturnValue(Promise.resolve("result"));
        handlerMock.validate = jest.fn().mockReturnValue(Promise.reject("testError"));
        const info: FakeInfo = {
            loadType: LoadType.Cache
        };
        const result = await handlerMock.handle(info);

        expect(result).toEqual(expectedResult);

    });

});