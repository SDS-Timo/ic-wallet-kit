import { HplStateCacheRepository } from "@hpl/repositories/cache/hplStateCacheRepository/hplStateCacheRepository";
import { HplStateCacheModel } from "@hpl/types/cache/hplStateCacheModel";
import { ILogger, IStorage, IdentifierService, jsonStringify } from "@ic-wallet-kit/common";

describe("HplStateCacheRepository Process Tests", () => {
    let repository: HplStateCacheRepository;
    let mockLogger: jest.Mocked<ILogger>;
    let mockStorage: jest.Mocked<IStorage>;
    let mockIdentifierService: jest.Mocked<IdentifierService>;

    const mockStateData: HplStateCacheModel = {
        ftSupplies: [{
            assetId: 1n,
            ftSupply: 11n
        }],
        accounts: [{
            accountId: 2n,
            accountState: {
                ft: 1n
            }
        }],
        virtualAccounts: [{
            virtualAccountId: 3n,
            accountId: 2n,
            accountState: {
                ft: 1n
            },
            time: 0n
        }],
        remoteAccounts: [{
            remotePrincipal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
            remoteAccountId: 3n,
            accountState: {
                ft: 1n
            },
            time: 0n
        }]

    };

    beforeEach(() => {
        mockLogger = { logError: jest.fn() } as any;
        mockStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        } as any;
        mockIdentifierService = { getPrincipal: jest.fn().mockReturnValue("mockPrincipal") } as any;

        repository = new HplStateCacheRepository(mockLogger, mockIdentifierService, mockStorage);
    });

    it("should return undefined if admin state does not exist in storage", () => {
        mockStorage.getItem.mockReturnValue(null);

        const result = repository.getHplAdminState("test-canister");
        expect(result).toBeUndefined();
    });

    it("should log an error and return undefined for invalid JSON data", () => {
        mockStorage.getItem.mockReturnValue("invalid-json");

        const result = repository.getHplAdminState("test-canister");
        expect(mockLogger.logError).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it("should return parsed state data if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockStateData));

        const result = repository.getHplAdminState("test-canister");
        expect(result).toEqual(mockStateData);
    });

    it("should store admin state data in storage", () => {

        repository.setHplAdminState("test-canister", mockStateData);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplAdminState",
            jsonStringify(mockStateData)
        );
    });

    it("should remove admin state data from storage", () => {
        repository.removeAdminState("test-canister");

        expect(mockStorage.removeItem).toHaveBeenCalledWith("mockPrincipal-test-canister-hplAdminState");
    });

    it("should return undefined if admin state does not exist in storage", () => {
        mockStorage.getItem.mockReturnValue(null);

        const result = repository.getHplFtSuppliesState("test-canister");
        expect(result).toBeUndefined();
    });

    it("should log an error and return undefined for invalid JSON data", () => {
        mockStorage.getItem.mockReturnValue("invalid-json");

        const result = repository.getHplFtSuppliesState("test-canister");
        expect(mockLogger.logError).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it("should return parsed state data if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockStateData));

        const result = repository.getHplFtSuppliesState("test-canister");
        expect(result).toEqual(mockStateData);
    });

    it("should store ftSupplies state data in storage", () => {

        repository.setHplFtSuppliesState("test-canister", mockStateData.ftSupplies);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplFtSuppliesState",
            jsonStringify(mockStateData.ftSupplies)
        );
    });

    it("should remove ftSupplies state data from storage", () => {
        repository.removeHplFtSuppliesState("test-canister");

        expect(mockStorage.removeItem).toHaveBeenCalledWith("mockPrincipal-test-canister-hplFtSuppliesState");
    });

    it("should return parsed state data if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockStateData));

        const result = repository.getHplAccountState("test-canister");
        expect(result).toEqual(mockStateData);
    });

    it("should store account state data in storage", () => {

        repository.setHplAccountState("test-canister", mockStateData.accounts);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplAccountState",
            jsonStringify(mockStateData.accounts)
        );
    });

    it("should remove account state data from storage", () => {
        repository.removeHplAccountState("test-canister");

        expect(mockStorage.removeItem).toHaveBeenCalledWith("mockPrincipal-test-canister-hplAccountState");
    });

    it("should return parsed state data if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockStateData));

        const result = repository.getHplVirtualAccountState("test-canister");
        expect(result).toEqual(mockStateData);
    });

    it("should store virtual account state data in storage", () => {

        repository.setHplVirtualAccountState("test-canister", mockStateData.virtualAccounts);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplVirtualAccountState",
            jsonStringify(mockStateData.virtualAccounts)
        );
    });

    it("should remove virtual account state data from storage", () => {
        repository.removeHplVirtualAccountState("test-canister");

        expect(mockStorage.removeItem).toHaveBeenCalledWith("mockPrincipal-test-canister-hplVirtualAccountState");
    });

    it("should return parsed state data if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockStateData));

        const result = repository.getHplRemoteAccountState("test-canister");
        expect(result).toEqual(mockStateData);
    });

    it("should store remote account state data in storage", () => {

        repository.setHplRemoteAccountState("test-canister", mockStateData.remoteAccounts);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplRemoteAccountState",
            jsonStringify(mockStateData.remoteAccounts)
        );
    });

    it("should return parsed state data if valid JSON is stored", () => {
        mockStorage.getItem.mockReturnValue(jsonStringify(mockStateData));

        const result = repository.getHplRemotesToLookState("test-canister");
        expect(result).toEqual(mockStateData);
    });

    it("should store remotes to look state data in storage", () => {

        repository.setHplRemotesToLookState("test-canister", mockStateData.remoteAccounts);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            "mockPrincipal-test-canister-hplRemotesToLookState",
            jsonStringify(mockStateData.remoteAccounts)
        );
    });

    it("should remove remotes to look state data from storage", () => {
        repository.removeHplRemotesToLookState("test-canister");

        expect(mockStorage.removeItem).toHaveBeenCalledWith("mockPrincipal-test-canister-hplRemotesToLookState");
    });
});
