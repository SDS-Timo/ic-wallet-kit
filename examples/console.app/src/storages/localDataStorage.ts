import { IStorage, IdentifierService } from "@ic-wallet-kit/common";
import { LocalStorage } from "node-localstorage";

export class LocalDataStorage implements IStorage {

    private localStorage: LocalStorage;

    constructor(identity: IdentifierService, directory: string) {
        this.localStorage = new LocalStorage(`${directory}/${identity.getPrincipalStr()}`);
    }

    getItem(key: string): string | null {
        return this.localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        return this.localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        return this.localStorage.removeItem(key);
    }
}
