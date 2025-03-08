import { IStorage } from "@ic-wallet-kit/common";

export function mockStorage(): IStorage {
    const storage: IStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    }
    return storage;
}