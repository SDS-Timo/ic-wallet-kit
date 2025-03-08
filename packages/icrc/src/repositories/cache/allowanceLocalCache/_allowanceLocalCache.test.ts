import { ILogger, IStorage, jsonStringify } from "@ic-wallet-kit/common";
import { mockLedgerAddress, mockOwnerPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockStorage } from "@icrc/__tests_utils/mockStorage";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AllowanceContactCacheModel, SubAccountId } from "@icrc/types";
import { AllowanceDataModel } from "@icrc/types/allowances/allowanceDataModel";


describe("AllowanceLocalCache", () => {
    let logger: ILogger;
    let identifierService;
    let storage: IStorage;
    let cache: AllowanceLocalCache;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        storage = mockStorage();
        cache = new AllowanceLocalCache(logger, identifierService, storage);
    });

    it("AllowanceLocalCache:getAllowance should return the correct allowance", () => {
        const mockAllowance = {
            ledgerAddress: "mock-ledger",
            spenderPrincipal: "spender-1",
            subAccountId: "sub-1",
            spenderSubId: "sub-2",
            amount: BigInt(1000),
            expiration: BigInt(2000)
        };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify([mockAllowance]));

        const result = cache.getAllowance("spender-1", "mock-ledger", "sub-1", "sub-2");
        expect(result).toEqual(mockAllowance);
    });

    it("AllowanceLocalCache:addAllowance should add a new allowance", () => {
        const newAllowance: AllowanceDataModel = {
            ledgerAddress: "mock-ledger",
            spenderPrincipal: "spender-2",
            subAccountId: SubAccountId.parseFromString("0x1"),
            spenderSubId: SubAccountId.parseFromString("0x2"),
            amount: BigInt(500),
            expiration: BigInt(3000)
        };
        cache.addAllowance(newAllowance);
        expect(storage.setItem).toHaveBeenCalled();
    });

    it("AllowanceLocalCache:addAllowance should add a new allowance", () => {
        const newAllowance: AllowanceDataModel = {
            ledgerAddress: "mock-ledger",
            spenderPrincipal: "spender-2",
            subAccountId: SubAccountId.parseFromString("0x1"),
            spenderSubId: SubAccountId.parseFromString("0x2"),
            amount: BigInt(500),
            expiration: BigInt(3000)
        };

        const existingAllowance = {
            ledgerAddress: "mock-ledger",
            spenderPrincipal: "spender-2",
            subAccountId: "0x1",
            spenderSubId: "0x2",
            amount: BigInt(700),
            expiration: BigInt(4000)
        };

        storage.getItem = jest.fn().mockReturnValue(jsonStringify([existingAllowance]));

        cache.addAllowance(newAllowance);
        expect(storage.setItem).toHaveBeenCalled();
    });

    it("AllowanceLocalCache:updateOrAddAllowance should update an existing allowance", () => {
        const existingAllowance = {
            ledgerAddress: "mock-ledger",
            spenderPrincipal: "spender-3",
            subAccountId: "sub-1",
            spenderSubId: "sub-2",
            amount: BigInt(700),
            expiration: BigInt(4000)
        };

        storage.getItem = jest.fn().mockReturnValue(jsonStringify([existingAllowance]));

        const updatedAllowance = { ...existingAllowance, amount: BigInt(800) };
        cache.updateOrAddAllowance(updatedAllowance);

        expect(storage.setItem).toHaveBeenCalledWith(cache["getKey"](), jsonStringify([updatedAllowance]));
    });

    it("AllowanceLocalCache:updateOrAddAllowance should update empty cache", () => {
        const existingAllowance = {
            ledgerAddress: "mock-ledger",
            spenderPrincipal: "spender-3",
            subAccountId: "sub-1",
            spenderSubId: "sub-2",
            amount: BigInt(700),
            expiration: BigInt(4000)
        };

        storage.getItem = jest.fn().mockReturnValue(jsonStringify([]));

        const updatedAllowance = { ...existingAllowance, amount: BigInt(800) };
        cache.updateOrAddAllowance(updatedAllowance);

        expect(storage.setItem).toHaveBeenCalledWith(cache["getKey"](), jsonStringify([updatedAllowance]));
    });

    it("AllowanceLocalCache:removeAllowance should remove an allowance", () => {
        const mockAllowance = {
            ledgerAddress: "mock-ledger",
            spenderPrincipal: "spender-4",
            subAccountId: "sub-1",
            spenderSubId: "sub-2"
        };
        storage.getItem = jest.fn().mockReturnValue(jsonStringify([mockAllowance, { ...mockAllowance, spenderPrincipal: "spender-5" }]));

        cache.removeAllowance("spender-5", "mock-ledger", "sub-1", "sub-2");
        expect(storage.setItem).toHaveBeenCalledWith(cache["getKey"](), jsonStringify([mockAllowance]));
    });

    it("AllowanceLocalCache:getAllowanceForContact should return allowance for contact", () => {
        const mockAllowance = {
            ledgerAddress: "mock-ledger",
            senderPrincipal: "sender-1",
            subAccountId: "sub-1"
        };

        storage.getItem = jest.fn().mockReturnValue(jsonStringify([mockAllowance]));

        const result = cache.getAllowanceForContact("sender-1", "mock-ledger", "sub-1");
        expect(result).toEqual(mockAllowance);
    });

    it("AllowanceLocalCache:updateAllowanceForContact should update allowance for contact exists", () => {
        const mockAllowance: AllowanceContactCacheModel = {
            ledgerAddress: mockLedgerAddress,
            subAccountId: "0x1",
            senderPrincipal: mockOwnerPrincipalString(),
            amount: 101n
        };

        const existingAllowance = {
            ledgerAddress: mockLedgerAddress,
            subAccountId: "0x1",
            senderPrincipal: mockOwnerPrincipalString(),
            amount: 10n
        };

        storage.getItem = jest.fn().mockReturnValue(jsonStringify([existingAllowance]));

        cache.updateAllowanceForContact(mockAllowance);
        expect(storage.setItem).toHaveBeenCalledWith(cache["getKeyForContact"](), jsonStringify([mockAllowance]));
    });

    it("AllowanceLocalCache:updateAllowanceForContact should update allowance for contact not exists", () => {
        const mockAllowance: AllowanceContactCacheModel = {
            ledgerAddress: mockLedgerAddress,
            subAccountId: "0x1",
            senderPrincipal: mockOwnerPrincipalString(),
            amount: 101n
        };

        storage.getItem = jest.fn().mockReturnValue(jsonStringify([]));

        cache.updateAllowanceForContact(mockAllowance);
        expect(storage.setItem).toHaveBeenCalledWith(cache["getKeyForContact"](), jsonStringify([mockAllowance]));
    });

    it("AllowanceLocalCache:getItemsForContact fail", () => {

        storage.getItem = jest.fn().mockReturnValue({});
        logger.logError = jest.fn();

        cache["getItemsForContact"]();

        expect(logger.logError).toHaveBeenCalled();
    });

    it("AllowanceLocalCache:getItems fail", () => {

        storage.getItem = jest.fn().mockReturnValue({});
        logger.logError = jest.fn();

        cache["getItems"]();
        expect(logger.logError).toHaveBeenCalled();
    });

    it("AllowanceLocalCache:getItems empty value", () => {
        storage.getItem = jest.fn().mockReturnValue(undefined);
        logger.logError = jest.fn();
        const result = cache["getItemsForContact"]();
        expect(result).toEqual([]);
    });

});
