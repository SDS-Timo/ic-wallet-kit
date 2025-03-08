import { ILogger } from "@common/logger";
import { ReplicationCollectionDetails } from "@common/replications/replicationCollectionDetails";
import { ReplicationConfiguration } from "@common/replications/replicationConfiguration";
import { RxSyncStateBaseService } from "@common/replications/rxSyncStateBaseService";
import { IdentifierService } from "@common/services";
import { BaseRxDbContext, CollectionRxDocument } from "@common/storage";
import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import "reflect-metadata";
import { RxReplicationState } from "rxdb/plugins/replication";
export type createCanisterFunc = (canisterId: string | Principal, options?: any) => ActorSubclass<any>;
export declare class ReplicationProcessor {
    protected identifierService: IdentifierService;
    protected rxSyncStateService: RxSyncStateBaseService;
    protected rxDbContext: BaseRxDbContext;
    private createCanisterFunc;
    private collectionDetailList;
    replicationStateList: RxReplicationState<CollectionRxDocument, any>[];
    protected replicaCanister: ActorSubclass<any>;
    protected logger: ILogger;
    protected configuration: ReplicationConfiguration;
    constructor(logger: ILogger, configuration: ReplicationConfiguration, identifierService: IdentifierService, rxSyncStateService: RxSyncStateBaseService, rxDbContext: BaseRxDbContext, createCanisterFunc: createCanisterFunc);
    initReplication(collectionDetailList: ReplicationCollectionDetails[]): Promise<void>;
    private initAllReplication;
    private initReplicationInternal;
    private processConnectionError;
}
