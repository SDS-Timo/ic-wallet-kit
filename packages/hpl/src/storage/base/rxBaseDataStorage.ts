import { HplDbContext } from "@hpl/storage/database";
import { BaseDataStorage, IdentifierService, ILogger } from "@ic-wallet-kit/common";

import "reflect-metadata";
import { Inject, Service } from "typedi";



@Service()
export abstract class RxBaseDataStorage<TObject> extends BaseDataStorage<TObject, HplDbContext> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        identifierService: IdentifierService,
        context: HplDbContext
    ) {
        super(logger, identifierService, context);
    }
}