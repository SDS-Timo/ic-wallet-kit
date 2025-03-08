import { HplFeeConstantCacheRepository } from "@hpl/repositories/cache/hplFeeConstantCacheRepository/hplFeeConstantCacheRepository";
import { IdentifierService, ILogger, IStorage, jsonStringify } from "@ic-wallet-middleware/common";

describe("HplFeeConstantCacheRepository Process Tests", () => {
    let repository: HplFeeConstantCacheRepository;
    let mockLogger: jest.Mocked<ILogger>;
    let mockStorage: jest.Mocked<IStorage>;
    let mockIdentifierService: jest.Mocked<IdentifierService>;

    beforeEach(() => {
        mockLogger = { logError: jest.fn() } as any;
        mockStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        } as any;
        mockIdentifierService = { getPrincipal: jest.fn().mockReturnValue("mockPrincipal") } as any;

        repository = new HplFeeConstantCacheRepository(mockLogger, mockIdentifierService, mockStorage);
    });

    it("should return undefined if data does not exist in storage", () => {
        mockStorage.getItem.mockReturnValue(null);

        const result = repository.getFeeConstantByCanisterId("test-canister");
        expect(result).toBeUndefined();
    });

    it("should log an error and return undefined for invalid JSON data", () => {
        mockStorage.getItem.mockReturnValue("invalid-json");

        const result = repository.getFeeConstantByCanisterId("test-canister");
        expect(result).toBeUndefined();
    });

    it("should return parsed data if valid JSON is stored", () => {
        const mockFeeConstant = BigInt(100);
        mockStorage.getItem.mockReturnValue(jsonStringify(mockFeeConstant));

        const result = repository.getFeeConstantByCanisterId("test-canister");
        expect(result).toEqual(mockFeeConstant);
    });

    it("should store fee constant in storage", () => {
        const mockFeeConstant = BigInt(200);

        repository.setFeeConstant("test-canister", mockFeeConstant);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplFeeConstant",
            jsonStringify(mockFeeConstant)
        );
    });

    it("should remove fee constant from storage", () => {
        repository.removeFeeConstant("test-canister");

        expect(mockStorage.removeItem).toHaveBeenCalledWith("mockPrincipal-test-canister-hplFeeConstant");
    });
});
