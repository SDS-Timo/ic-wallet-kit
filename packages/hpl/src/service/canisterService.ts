import "reflect-metadata";
import { Service } from "typedi";

Service()
export class CanisterService {

    constructor(ledgerCanisterId: string, dictionaryCanisterId: string, ownerCanisterId: string) {
        this._ledgerCanisterId = ledgerCanisterId;
        this._dictionaryCanisterId = dictionaryCanisterId;
        this._ownerCanisterId = ownerCanisterId;
    }


    private _ledgerCanisterId: string;
    private _dictionaryCanisterId: string;
    private _ownerCanisterId: string;

    public getLedgerCanisterId(): string {
        return this._ledgerCanisterId;
    }

    public getDictionaryCanisterId(): string {
        return this._dictionaryCanisterId;
    }
    public getOwnerCanisterId(): string {
        return this._ownerCanisterId;
    }
}
