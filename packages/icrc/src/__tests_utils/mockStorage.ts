import { IStorage } from "@ic-wallet-middleware/common";

export function mockStorage(): IStorage {
    const storage: IStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    }
    return storage;
}