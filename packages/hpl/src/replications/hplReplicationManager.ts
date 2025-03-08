
import { HplDbContext, IHplAccountDataStorage, IHplAssetDataStorage, IHplContactDataStorage, IHplVirtualAccountDataStorage } from "@hpl/storage";
import { BaseRxDbDocument, createCanisterFunc, IdentifierService, ILogger, ReplicationCollectionDetails, ReplicationConfiguration, ReplicationProcessor } from "@ic-wallet-middleware/common";


import "reflect-metadata";
import { Inject, Service } from "typedi";
import { HplRxSyncStateService } from "./hplRxSyncStateService";


@Service()
export class HplReplicationManager {
    private replicationProcessor: ReplicationProcessor;

    constructor(@Inject("ILogger")
    logger: ILogger,
        @Inject("HplReplicationConfiguration")
        replicationConfiguration: ReplicationConfiguration,
        identifierService: IdentifierService,
        hplRxSyncStateService: HplRxSyncStateService,
        hplDbContext: HplDbContext,
        @Inject("createHplCanisterFunc")
        createCanisterFunc: createCanisterFunc,
        @Inject("IHplAccountDataStorage")
        private hplAccountDataStorage: IHplAccountDataStorage,
        @Inject("IHplAssetDataStorage")
        private hplAssetDataStorage: IHplAssetDataStorage,
        @Inject("IHplVirtualAccountDataStorage")
        private hplVirtualAccountDataStorage: IHplVirtualAccountDataStorage,
        @Inject("IHplContactDataStorage")
        private hplContactDataStorage: IHplContactDataStorage
    ) {
        this.replicationProcessor = new ReplicationProcessor(logger,
            replicationConfiguration,
            identifierService,
            hplRxSyncStateService,
            hplDbContext,
            createCanisterFunc);
    }

    public async init(): Promise<void> {

        const replicationCollectionList: ReplicationCollectionDetails[] = [];
        replicationCollectionList.push({
            collectionName: this.hplAssetDataStorage.collectionName,
            async replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pullHplAssets(updatedAt, id, batchSize);
            },
            async replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pushHplAssets(items);
            }
        });
        replicationCollectionList.push({
            collectionName: this.hplAccountDataStorage.collectionName,
            async replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pullHplAccounts(updatedAt, id, batchSize);
            },
            async replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pushHplAccounts(items);

            }
        });
        replicationCollectionList.push({
            collectionName: this.hplVirtualAccountDataStorage.collectionName,
            async replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pullHplVirtualAccounts(updatedAt, id, batchSize);
            },
            async replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pushHplVirtualAccounts(items);
            }
        });
        replicationCollectionList.push({
            collectionName: this.hplContactDataStorage.collectionName,
            async replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pullHplContacts(updatedAt, id, batchSize);
            },
            async replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pushHplContacts(items);
            }
        });
        await this.replicationProcessor.initReplication(replicationCollectionList);
    }
}
