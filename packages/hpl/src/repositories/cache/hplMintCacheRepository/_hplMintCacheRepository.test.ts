import { HplMintCacheRepository } from "@hpl/repositories/cache/hplMintCacheRepository/hplMintCacheRepository";
import { HplMintCacheModel } from "@hpl/types/cache/hplMintCacheModel";
import { HplMintDataCacheModel } from "@hpl/types/cache/hplMintDataCacheModel";
import { IdentifierService, ILogger, IStorage, jsonStringify, ValidationError } from "@ic-wallet-kit/common";

describe("HplMintCacheRepository Process Tests", () => {
    let repository: HplMintCacheRepository;
    let mockLogger: jest.Mocked<ILogger>;
    let mockStorage: jest.Mocked<IStorage>;
    let mockIdentifierService: jest.Mocked<IdentifierService>;

    const mockMint: HplMintCacheModel = { canisterId: "test-canister", isMinter: true };

    const mockMintData: HplMintDataCacheModel = {
        virtualAccountsMints: [mockMint],
    };

    beforeEach(() => {
        mockLogger = { logError: jest.fn() } as any;
        mockStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        } as any;
        mockIdentifierService = { getPrincipal: jest.fn().mockReturnValue("mockPrincipal") } as any;

        repository = new HplMintCacheRepository(mockLogger, mockIdentifierService, mockStorage);
    });

    it("should return undefined if mint data does not exist in storage", () => {
        mockStorage.getItem.mockReturnValue(null);

        const result = repository.getHplMintByCanisterId("test-canister");
        expect(result).toBeUndefined();
    });

    it("should log an error and return undefined for invalid JSON data", () => {
        mockStorage.getItem.mockReturnValue("invalid-json");

        const result = repository.getHplMintByCanisterId("test-canister");
        expect(result).toBeUndefined();
    });

    it("should return parsed mint data if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockMintData));

        const result = repository.getHplMintByCanisterId("test-canister");
        expect(result).toEqual(mockMintData.virtualAccountsMints[0]);
    });

    it("should return undefined if the specified canister ID does not exist", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockMintData));

        const result = repository.getHplMintByCanisterId("test-canister-1");
        expect(result).toBeUndefined();
    });

    it("should store mint data in storage", () => {
        const existingData: HplMintDataCacheModel = { virtualAccountsMints: [] };
        mockStorage.getItem.mockReturnValue(jsonStringify(existingData));

        repository.setHplMint(mockMint);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-hplMints",
            jsonStringify({
                virtualAccountsMints: [mockMint],
            })
        );
    });

    it("should update existing mint data in storage", () => {
        const existingData: HplMintDataCacheModel = {
            virtualAccountsMints: [{ canisterId: "test-canister", isMinter: false }],
        };
        mockStorage.getItem.mockReturnValue(jsonStringify(existingData));

        repository.setHplMint(mockMint);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-hplMints",
            jsonStringify({
                virtualAccountsMints: [{ canisterId: "test-canister", isMinter: true }],
            })
        );
    });

    it("should update not existing mint data in storage", () => {
        mockStorage.getItem.mockReturnValue(null);

        repository.setHplMint(mockMint);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-hplMints",
            jsonStringify({
                virtualAccountsMints: [{ canisterId: "test-canister", isMinter: true }],
            })
        );
    });

    it("should update mint data in storage, if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue("invalid-json");

        repository.setHplMint(mockMint);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-hplMints",
            jsonStringify({
                virtualAccountsMints: [{ canisterId: "test-canister", isMinter: true }],
            })
        );
    });

    it("should remove mint data from storage", () => {
        const existingData: HplMintDataCacheModel = {
            virtualAccountsMints: [mockMint],
        };
        mockStorage.getItem.mockReturnValue(jsonStringify(existingData));

        repository.removeMint("test-canister");

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-hplMints",
            jsonStringify({
                virtualAccountsMints: [],
            })
        );
    });

    it("should throw a ValidationError if trying to remove a non-existing mint", () => {
        mockStorage.getItem.mockReturnValue(null);

        expect(() => repository.removeMint("test-canister")).toThrow(
            new ValidationError("virtual.account.not.found", "", "Virtual Account Not Found")
        );
    });
});
