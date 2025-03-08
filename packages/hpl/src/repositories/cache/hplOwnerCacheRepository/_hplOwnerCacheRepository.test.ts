import { HplOwnerCacheRepository } from "@hpl/repositories/cache/hplOwnerCacheRepository/hplOwnerCacheRepository";
import { HplOwnerDataCacheModel } from "@hpl/types/cache/hplOwnerDataCacheModel";
import { IdentifierService, ILogger, IStorage, jsonStringify } from "@ic-wallet-kit/common";

describe("HplOwnerCacheRepository Process Tests", () => {
    let repository: HplOwnerCacheRepository;
    let mockLogger: jest.Mocked<ILogger>;
    let mockStorage: jest.Mocked<IStorage>;
    let mockIdentifierService: jest.Mocked<IdentifierService>;

    const mockOwnerData: HplOwnerDataCacheModel = { ownerId: BigInt(12345) };

    beforeEach(() => {
        mockLogger = { logError: jest.fn() } as any;
        mockStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        } as any;
        mockIdentifierService = { getPrincipal: jest.fn().mockReturnValue("mockPrincipal") } as any;

        repository = new HplOwnerCacheRepository(mockLogger, mockIdentifierService, mockStorage);
    });

    it("should return undefined if owner data does not exist in storage", () => {
        mockStorage.getItem.mockReturnValue(null);

        const result = repository.getHplOwnerByCanisterId("test-canister");
        expect(result).toBeUndefined();
    });

    it("should log an error and return undefined for invalid JSON data", () => {
        mockStorage.getItem.mockReturnValue("invalid-json");

        const result = repository.getHplOwnerByCanisterId("test-canister");
        expect(result).toBeUndefined();
    });

    it("should return parsed owner data if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockOwnerData));

        const result = repository.getHplOwnerByCanisterId("test-canister");
        expect(result).toEqual(mockOwnerData);
    });

    it("should return undefined if the specified canister ID does not exist", () => {
        mockStorage.getItem.mockReturnValue(null);

        const result = repository.getHplOwnerByCanisterId("wrong-canister");
        expect(result).toBeUndefined();
    });

    it("should store owner data in storage", () => {

        repository.setHplOwner("test-canister", mockOwnerData);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplOwners",
            jsonStringify(mockOwnerData)
        );
    });

    it("should remove owner data from storage", () => {
        repository.removeOwner("test-canister");

        expect(mockStorage.removeItem).toHaveBeenCalledWith("mockPrincipal-test-canister-hplOwners");
    });
});
