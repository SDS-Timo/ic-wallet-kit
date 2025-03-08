import { IdentifierService, ILogger, IStorage, jsonStringify, ValidationError } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockStorage } from "@icrc/__tests_utils/mockStorage";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { AssetLocalCache } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";

describe("AssetLocalCache", () => {

    let logger: ILogger;
    let identifierService: IdentifierService;
    let storage: IStorage;
    let cache: AssetLocalCache;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        storage = mockStorage();
        cache = new AssetLocalCache(logger, identifierService, storage);
    });

    it("AssetLocalCache:getSubAccountById should return sub-account if found", () => {
        const ledgerAddress = "mock-ledger-address";
        const subAccountId = "sub-account-1";
        const expectedSubAccount = { subAccountId, balance: BigInt(1000) };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify({ subAccounts: [expectedSubAccount] }));

        const result = cache.getSubAccountById(ledgerAddress, subAccountId);
        expect(result).toEqual(expectedSubAccount);
    });

    it("AssetLocalCache:getSubAccountById should return sub-account if not found", () => {
        const ledgerAddress = "mock-ledger-address1";
        const subAccountId = "sub-account-1";
        storage.getItem = jest.fn().mockReturnValue(undefined);

        const result = cache.getSubAccountById(ledgerAddress, subAccountId);
        expect(result).toEqual(undefined);
    });

    it("AssetLocalCache:getAssetById should return asset if found", () => {
        const ledgerAddress = "mock-ledger-address";
        const expectedAsset = { ledgerAddress, subAccounts: [] };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(expectedAsset));

        const result = cache.getAssetById(ledgerAddress);
        expect(result).toEqual(expectedAsset);
    });

    it("AssetLocalCache:getAssetById should return asset if fail", () => {
        const ledgerAddress = "mock-ledger-address";
        storage.getItem = jest.fn().mockReturnValue({});

        logger.logError = jest.fn();
        cache.getAssetById(ledgerAddress);

        expect(logger.logError).toHaveBeenCalled();
    });

    it("AssetLocalCache:getAssetById should return asset if not found", () => {
        const ledgerAddress = "mock-ledger-address";
        storage.getItem = jest.fn().mockReturnValue(undefined);

        logger.logError = jest.fn();
        const result = cache.getAssetById(ledgerAddress);
        expect(result).toEqual(undefined);
    });

    it("AssetLocalCache:setSubAccount should update or add sub-account", () => {
        const ledgerAddress = "mock-ledger-address";
        const subAccount = { subAccountId: "sub-account-1", balance: BigInt(500) };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify({ ledgerAddress, subAccounts: [] }));

        cache.setSubAccount(ledgerAddress, subAccount);
        expect(storage.setItem).toHaveBeenCalledWith(cache["getKey"](ledgerAddress), jsonStringify({ ledgerAddress, subAccounts: [subAccount] }));
    });

    it("AssetLocalCache:setSubAccount should update or add sub-account", () => {
        const ledgerAddress = "mock-ledger-address";
        const subAccount = { subAccountId: "sub-account-1", balance: BigInt(500) };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify({ ledgerAddress, subAccounts: [{ ...subAccount, balance: BigInt(600) }] }));

        cache.setSubAccount(ledgerAddress, subAccount);
        expect(storage.setItem).toHaveBeenCalledWith(cache["getKey"](ledgerAddress), jsonStringify({ ledgerAddress, subAccounts: [subAccount] }));
    });

    it("AssetLocalCache:setAsset should store asset in cache", () => {
        const asset = { ledgerAddress: "mock-ledger-address", subAccounts: [] };
        cache.setAsset(asset);
        expect(storage.setItem).toHaveBeenCalledWith(
            `${identifierService.getPrincipal()}-mock-ledger-address`,
            jsonStringify(asset)
        );
    });

    it("AssetLocalCache:removeAsset should remove asset from cache", () => {
        const ledgerAddress = "mock-ledger-address";
        cache.removeAsset(ledgerAddress);
        expect(storage.removeItem).toHaveBeenCalledWith(
            `${identifierService.getPrincipal()}-mock-ledger-address`
        );
    });

    it("AssetLocalCache:removeSubAccount should remove sub-account if balance is zero", () => {
        const ledgerAddress = "mock-ledger-address";
        const subAccountId = SubAccountId.parseFromString("0x1");
        const asset = { ledgerAddress, subAccounts: [{ subAccountId: "0x1", balance: BigInt(0) }] };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(asset));

        cache.removeSubAccount(ledgerAddress, subAccountId);
        expect(storage.setItem).toHaveBeenCalled();
    });

    it("AssetLocalCache:removeSubAccount should throw error if sub-account has balance", () => {
        const ledgerAddress = "mock-ledger-address";
        const subAccountId = SubAccountId.parseFromString("0x1");
        const asset = { ledgerAddress, subAccounts: [{ subAccountId: "0x1", balance: BigInt(1000) }] };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify(asset));

        expect(() => cache.removeSubAccount(ledgerAddress, subAccountId)).toThrow(ValidationError);
    });

    it("AssetLocalCache:removeSubAccount should throw error if sub-account has balance", () => {
        const ledgerAddress = "mock-ledger-address";
        const subAccountId = SubAccountId.parseFromString("0x1");
        storage.getItem = jest.fn().mockReturnValue(undefined);

        expect(() => cache.removeSubAccount(ledgerAddress, subAccountId)).toThrow(new ValidationError("asset.not.found",
            "ledgerAddress",
            "Asset Not Found"));
    });
});
