import { CacheDataError } from "@common/errors/cacheDataError";
import { BaseCacheDataHandlerV2, IInfo, LoadType } from "@common/handlers/baseCacheHandler";
import { MockLogger } from "@common/logger/logger.test";

interface FakeInfo extends IInfo {
}

interface FakeResult {
}

describe("BaseCacheDataHandlerV2", () => {
    let mockLogger = new MockLogger();
    let handler: BaseCacheDataHandlerV2<FakeInfo, FakeResult>;

    beforeEach(() => {

        jest.clearAllMocks();

        handler = new (class extends BaseCacheDataHandlerV2<FakeInfo, FakeResult> {
            async getLocalCacheData(info: FakeInfo) {
                return info.loadType === LoadType.Cache ? "cachedData" : undefined;
            }
            async getExternalData(info: FakeInfo) {
                return "externalData";
            }
            updateField(info: FakeInfo, data: any) { }
            getCacheDataError(info: FakeInfo) {
                return new CacheDataError("cache.error", "Cache retrieval failed");
            }
            getLoadForceType() {
                return [LoadType.Full, LoadType.Quick];
            }
        })(mockLogger);
    });

    it("should return cached data when available", async () => {
        const result = await handler.handle({ loadType: LoadType.Cache });
        expect(result).toBe("cachedData");
    });

    it("should fetch external data when load type is full", async () => {
        const result = await handler.handle({ loadType: LoadType.Full });
        expect(result).toBe("externalData");
    });

    it("should return cached data if external fetch fails", async () => {

        handler.getExternalData = jest.fn().mockRejectedValue(new Error("fetch failed"));

        const result = await handler.handle({ loadType: LoadType.Cache });
        expect(result).toBe("cachedData");
    });

    it("should return cached data if getInternalIcrcData fail and cache empty", async () => {

        handler.getExternalData = jest.fn().mockRejectedValue(new Error("fetch failed"));
        handler["getLocalCacheData"] = jest.fn().mockResolvedValue(undefined);

        handler["getInternalIcrcData"] = jest.fn().mockResolvedValue({ test: "tets" });
        const result = await handler.handle({ loadType: LoadType.Cache });

        expect(result).toEqual({ test: "tets" });
    });

    it("should throw cache data error if external fetch fails and no cache available", async () => {

        handler.getExternalData = jest.fn().mockRejectedValue(new Error("fetch failed"));

        await expect(handler.handle({ loadType: LoadType.Full })).rejects.toThrow("Cache retrieval failed");
    });

    it("isExternalData - returns true for force load types", () => {
        expect(handler["isExternalData"]({ loadType: LoadType.Full })).toBe(true);
        expect(handler["isExternalData"]({ loadType: LoadType.Cache })).toBe(false);
    });

    it("getInternalIcrcData - returns external data", async () => {
        const result = await handler["getInternalIcrcData"]({ loadType: LoadType.Full }, false);
        expect(result).toBe("externalData");
    });

    it("getInternalIcrcData - returns cache data when fetch fails", async () => {
        handler["getExternalData"] = jest.fn().mockRejectedValueOnce(new Error("fetch failed"));
        handler.getLocalCacheData = jest.fn().mockResolvedValue("cached data");
        const result = await handler["getInternalIcrcData"]({ loadType: LoadType.Full }, false);
        expect(result).toBe("cached data");
    });

    it("getInternalIcrcData - throws cache error if no cache available", async () => {
        handler.getCacheDataError = jest.fn().mockReturnValue(new CacheDataError("cache.error", "Cache retrieval failed"));
        handler["getExternalData"] = jest.fn().mockRejectedValueOnce(new Error("fetch failed"));
        handler["getLocalCacheData"] = jest.fn().mockResolvedValueOnce(undefined);
        await expect(handler["getInternalIcrcData"]({ loadType: LoadType.Full }, true)).rejects.toThrow("Cache retrieval failed");
    });

    it("getInternalIcrcData - returns cache data when fetch fails, throw error", async () => {
        const error = new Error("Test Error 1");
        handler["getExternalData"] = jest.fn().mockRejectedValue(error);
        handler.getLocalCacheData = jest.fn().mockResolvedValue("cached data");
        await expect(handler["getInternalIcrcData"]({ loadType: LoadType.Full }, true)).rejects.toThrow(error);
    });
});
