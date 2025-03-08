
import { ILogger } from "@common/logger";
import { ReplicationCollectionDetails } from "@common/replications/replicationCollectionDetails";
import { ReplicationConfiguration } from "@common/replications/replicationConfiguration";
import { RxSyncState, RxSyncStateBaseService } from "@common/replications/rxSyncStateBaseService";
import { IdentifierService } from "@common/services";
import { BaseRxDbContext, BaseRxDbDocument, CollectionRxDocument } from "@common/storage";
import { WatchOnlyIdentity } from "@common/types";
import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { AgentError } from "@dfinity/agent/lib/cjs/errors";
import { Principal } from "@dfinity/principal";
import "reflect-metadata";
import { lastOfArray } from "rxdb";
import { RxReplicationState, replicateRxCollection } from "rxdb/plugins/replication";
import { Inject } from "typedi";

export type createCanisterFunc = (canisterId: string | Principal, options?: any) => ActorSubclass<any>;

export class ReplicationProcessor {
    private collectionDetailList: ReplicationCollectionDetails[] = [];
    public replicationStateList: RxReplicationState<CollectionRxDocument, any>[] = [];
    protected replicaCanister: ActorSubclass<any>;
    protected logger: ILogger;
    protected configuration: ReplicationConfiguration;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        configuration: ReplicationConfiguration,
        protected identifierService: IdentifierService,
        protected rxSyncStateService: RxSyncStateBaseService,
        protected rxDbContext: BaseRxDbContext,
        private createCanisterFunc: createCanisterFunc
    ) {
        this.logger = logger
        this.configuration = configuration;
    }

    public async initReplication(collectionDetailList: ReplicationCollectionDetails[]) {

        if (this.configuration.enable) {

            const identity = this.identifierService.getIdentity();
            if (identity instanceof WatchOnlyIdentity) {
                this.logger.logDebug("replication unavailable for WatchOnlyIdentity");
                return;
            }

            this.collectionDetailList = collectionDetailList;
            await this.initAllReplication();
        }
    }

    private async initAllReplication() {

        while (this.replicationStateList.length > 0) {
            const replication = this.replicationStateList.pop();
            replication?.cancel();
        }

        for (let collectionDetail of this.collectionDetailList) {
            await this.initReplicationInternal(collectionDetail);
        }
    }

    private async initReplicationInternal(collectionDetail: ReplicationCollectionDetails) {

        const identity = this.identifierService.getIdentity();

        if (identity instanceof WatchOnlyIdentity) {
            this.logger.logDebug("replication unavailable for WatchOnlyIdentity");
            return;
        }

        const principal = this.identifierService.getPrincipalStr();

        const agent = await HttpAgent.create({
            identity: identity,
            host: this.configuration.host
        });

        this.replicaCanister = this.createCanisterFunc(this.configuration.replicaCanister, {
            agent: agent,
        });

        const collection = this.rxDbContext.db.collections[collectionDetail.collectionName];

        const replicationState = replicateRxCollection({
            collection: collection,
            replicationIdentifier: `${collectionDetail.collectionName}-${principal}`,
            deletedField: "deleted",
            autoStart: false,
            push: {
                handler: async (docs: any): Promise<any> => {
                    try {
                        const store = docs.map((x: any) => x.newDocumentState) as any;
                        const documentsPushed = await collectionDetail.replicationPush(this.replicaCanister, store);

                        this.rxSyncStateService.ChangeState(RxSyncState.Connected);

                        return documentsPushed;
                    }
                    catch (error: any) {

                        this.rxSyncStateService.ChangeState(RxSyncState.Disconnected);

                        this.processConnectionError(error);

                        this.logger.logError(error);

                        throw error;
                    }
                },
                batchSize: 10,
                modifier: (d: any) => d
            },
            pull: {
                handler: async (lastCheckpoint: any, batchSize: any): Promise<any> => {

                    try {

                        const id = (lastCheckpoint?.id) ? [lastCheckpoint.id] : [];
                        const updatedAt = lastCheckpoint?.updatedAt || 0;

                        let documentsFromRemote: BaseRxDbDocument[] | undefined = await await collectionDetail.replicationPull(this.replicaCanister, updatedAt, id, batchSize);
                        if (!documentsFromRemote) {
                            documentsFromRemote = [];
                        }

                        const result = {
                            documents: documentsFromRemote,
                            checkpoint:
                                documentsFromRemote.length === 0
                                    ? lastCheckpoint
                                    : {
                                        id: lastOfArray(documentsFromRemote)!.id,
                                        updatedAt: lastOfArray(documentsFromRemote)!.updatedAt,
                                    }
                        }

                        this.rxSyncStateService.ChangeState(RxSyncState.Connected);

                        return result;
                    }
                    catch (error: any) {

                        this.rxSyncStateService.ChangeState(RxSyncState.Disconnected);

                        this.processConnectionError(error);

                        this.logger.logError(error);
                        throw error;
                    }

                },
                batchSize: 10
            }
        })

        try {
            await replicationState.start();
        }
        catch (e) {
            this.logger.logError(e);
        }

        this.replicationStateList.push(replicationState);
    }

    private processConnectionError(error: any) {
        let e = error as AgentError;

        if (e && e.message == "Invalid certificate: Signature verification failed") {
            this.initAllReplication();
        }
    }
}