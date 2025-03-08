
import { HplDictionaryCacheRepository } from "@hpl/repositories/cache/hplDictionaryCacheRepository/hplDictionaryCacheRepository";
import { HplDictionaryDataCacheModel } from "@hpl/types/cache/hplDictionaryDataCacheModel";
import { IdentifierService, ILogger, IStorage, jsonStringify } from "@ic-wallet-kit/common";

describe("HplDictionaryCacheRepository Process Tests", () => {
    let repository: HplDictionaryCacheRepository;
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

        repository = new HplDictionaryCacheRepository(mockLogger, mockIdentifierService, mockStorage);
    });

    it("should return undefined if data does not exist in storage", () => {
        mockStorage.getItem.mockReturnValue(null);

        const result = repository.getHplDictionaryByCanisterId("test-canister");
        expect(result).toBeUndefined();
    });

    it("should log an error and return undefined for invalid JSON data", () => {
        mockStorage.getItem.mockReturnValue("invalid-json");

        const result = repository.getHplDictionaryByCanisterId("test-canister");
        expect(result).toBeUndefined();
    });

    it("should return parsed data if valid JSON is stored", () => {
        const mockData: HplDictionaryDataCacheModel = {
            assetsDictionary: [],
        };
        mockStorage.getItem.mockReturnValue(jsonStringify(mockData));

        const result = repository.getHplDictionaryByCanisterId("test-canister");
        expect(result).toEqual(mockData);
    });

    it("should store data in storage", () => {
        const mockData: HplDictionaryDataCacheModel = {
            assetsDictionary: [],
        };

        repository.setHplDictionary("test-canister", mockData);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplAssetDictionaries",
            jsonStringify(mockData)
        );
    });

    it("should remove data from storage", () => {
        repository.removeDictionary("test-canister");

        expect(mockStorage.removeItem).toHaveBeenCalledWith("mockPrincipal-test-canister-hplAssetDictionaries");
    });
});
