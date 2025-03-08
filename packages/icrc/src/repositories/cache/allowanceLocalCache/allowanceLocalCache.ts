import { ILogger, IStorage, IdentifierService, jsonParse, jsonStringify } from "@ic-wallet-kit/common";
import { AllowanceCacheModel } from "@icrc/types/allowances/allowanceCacheModel";
import { AllowanceContactCacheModel } from "@icrc/types/allowances/allowanceContactCacheModel";
import { AllowanceDataModel } from "@icrc/types/allowances/allowanceDataModel";
import { Inject, Service } from "typedi";

@Service()
export class AllowanceLocalCache {
    private logger: ILogger;
    private storage: IStorage;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IStorage")
        storage: IStorage
    ) {
        this.logger = logger;
        this.storage = storage;
    }

    public getAllowance(spenderPrincipal: string, ledgerAddress: string, subAccountId: string, spenderSubId: string): AllowanceCacheModel | undefined {
        const items = this.getItems();
        let item = items.find((r) => r.ledgerAddress === ledgerAddress
            && r.spenderPrincipal === spenderPrincipal
            && r.subAccountId === subAccountId
            && r.spenderSubId === spenderSubId);
        return item;
    }

    public addAllowance(info: AllowanceDataModel): AllowanceCacheModel {

        const allowance = {
            ledgerAddress: info.ledgerAddress,
            spenderPrincipal: info.spenderPrincipal,
            spenderSubId: info.spenderSubId.toString(),
            subAccountId: info.subAccountId.toString(),
            amount: info.amount,
            expiration: info.expiration
        };

        const items = this.getItems();
        const item = items.find((r) => r.ledgerAddress === allowance.ledgerAddress
            && r.spenderPrincipal === allowance.spenderPrincipal
            && r.subAccountId === allowance.subAccountId
            && r.spenderSubId === allowance.spenderSubId)

        if (!item) {
            items.push(allowance);
        }
        else {
            const index = items.indexOf(item);
            items[index] = allowance;
        }

        this.setItem(items);
        return allowance;
    }

    public updateOrAddAllowance(allowance: AllowanceCacheModel): AllowanceCacheModel {
        const items = this.getItems();
        let item = items.find((r) => r.ledgerAddress === allowance.ledgerAddress
            && r.spenderPrincipal === allowance.spenderPrincipal
            && r.subAccountId === allowance.subAccountId
            && r.spenderSubId === allowance.spenderSubId);

        if (!item) {
            items.push(allowance);
        }
        else {
            const index = items.indexOf(item);
            items[index] = allowance
        }
        this.setItem(items);
        return allowance;
    }

    public removeAllowance(spenderPrincipal: string, ledgerAddress: string, subAccountId: string, spenderSubId: string) {
        let items = this.getItems();
        items = items.filter((r) => !(r.ledgerAddress == ledgerAddress
            && r.spenderPrincipal == spenderPrincipal
            && r.subAccountId == subAccountId
            && r.spenderSubId == spenderSubId));

        this.setItem(items);
    }

    public getAllowanceForContact(senderPrincipal: string, ledgerAddress: string, subAccountId: string): AllowanceContactCacheModel | undefined {
        const items = this.getItemsForContact();
        let item = items.find((r) => r.ledgerAddress === ledgerAddress
            && r.senderPrincipal === senderPrincipal
            && r.subAccountId === subAccountId)
        return item;
    }

    public updateAllowanceForContact(allowance: AllowanceContactCacheModel): AllowanceContactCacheModel {
        const items = this.getItemsForContact();
        let item = items.find((r) => r.ledgerAddress === allowance.ledgerAddress
            && r.senderPrincipal === allowance.senderPrincipal
            && r.subAccountId === allowance.subAccountId);
        if (!item) {
            items.push(allowance);
        }
        else {
            const index = items.indexOf(item);
            items[index] = allowance;
        }
        this.setItemForContact(items);
        return allowance;
    }

    private getItems(): AllowanceCacheModel[] {
        const key = this.getKey();
        let result: AllowanceCacheModel[] = [];
        const value = this.storage.getItem(key);
        if (value) {
            try {
                result = jsonParse(value);
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
            }
        }
        return result;
    }

    private getItemsForContact(): AllowanceContactCacheModel[] {
        const key = this.getKeyForContact();
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const allowances = jsonParse(value);
                return allowances;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value]);
                return [];
            }
        }
        return [];
    }

    private setItem(allowances: AllowanceCacheModel[]): void {
        const key = this.getKey();
        this.storage.setItem(key, jsonStringify(allowances));
    }

    private setItemForContact(allowances: AllowanceContactCacheModel[]): void {
        const key = this.getKeyForContact();
        this.storage.setItem(key, jsonStringify(allowances));
    }

    private getKey(): string {
        return `${this.identifierService.getPrincipal()}-allowances`;
    }

    private getKeyForContact(): string {
        return `${this.identifierService.getPrincipal()}-contact-allowances`;
    }
}