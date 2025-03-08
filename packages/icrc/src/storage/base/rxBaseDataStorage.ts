import { BaseDataStorage, IdentifierService, ILogger } from "@ic-wallet-middleware/common";
import { IcrcDbContext } from "@icrc/storage/database/icrcDbContext";

import "reflect-metadata";
import { Inject } from "typedi";

export abstract class RxBaseDataStorage<TObject> extends BaseDataStorage<TObject, IcrcDbContext> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        identifierService: IdentifierService,
        context: IcrcDbContext
    ) {
        super(logger, identifierService, context);
    }
}