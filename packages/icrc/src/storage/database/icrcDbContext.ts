import { RxStorage } from "rxdb";
import DBSchemas from "./schema.json";

import { BaseRxDbContext, IdentifierService } from "@ic-wallet-kit/common";

export class IcrcDbContext extends BaseRxDbContext {

    constructor(
        private identifierService: IdentifierService,
        rxStorage: RxStorage<any, any>
    ) {
        super(rxStorage);
    }

    getDbName(): string {
        const principal = this.identifierService.getPrincipalStr();
        return `rx_db_icrc_${principal}`; // TODO: extends for readonly mode
    }

    getSchema() {
        return DBSchemas;
    }
}