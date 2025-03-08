
import { BaseRxDbDocument, createCanisterFunc, IdentifierService, ILogger, ReplicationCollectionDetails, ReplicationConfiguration, ReplicationProcessor } from "@ic-wallet-middleware/common";
import { IAllowanceDataStorage, IAssetDataStorage, IContactDataStorage, IcrcDbContext, IServiceDataStorage } from "@icrc/storage";
import { Inject, Service } from "typedi";
import { IcrcRxSyncStateService } from "./IcrcRxSyncStateService";

@Service()
export class IcrcReplicationManager {
    private replicationProcessor: ReplicationProcessor;

    constructor(@Inject("ILogger")
    logger: ILogger,
        @Inject("IcrcReplicationConfiguration")
        replicationConfiguration: ReplicationConfiguration,
        identifierService: IdentifierService,
        icrcRxSyncStateService: IcrcRxSyncStateService,
        icrcDbContext: IcrcDbContext,
        @Inject("createIcrcCanisterFunc")
        createCanisterFunc: createCanisterFunc,
        @Inject("IAllowanceDataStorage")
        private allowanceDataStorage: IAllowanceDataStorage,
        @Inject("IAssetDataStorage")
        private assetDataStorage: IAssetDataStorage,
        @Inject("IContactDataStorage")
        private contactDataStorage: IContactDataStorage,
        @Inject("IServiceDataStorage")
        private serviceDataStorage: IServiceDataStorage,
    ) {
        this.replicationProcessor = new ReplicationProcessor(logger,
            replicationConfiguration,
            identifierService,
            icrcRxSyncStateService,
            icrcDbContext,
            createCanisterFunc);
    }

    public async init(): Promise<void> {
        const replicationCollectionList: ReplicationCollectionDetails[] = [];
        replicationCollectionList.push({
            collectionName: this.allowanceDataStorage.collectionName,
            async replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pullAllowances(updatedAt, id, batchSize);
            },
            async replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pushAllowances(items);
            }
        });

        replicationCollectionList.push({
            collectionName: this.assetDataStorage.collectionName,
            async replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pullAssets(updatedAt, id, batchSize);
            },
            async replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pushAssets(items);

            }
        });

        replicationCollectionList.push({
            collectionName: this.contactDataStorage.collectionName,
            async replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pullContacts(updatedAt, id, batchSize);
            },
            async replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pushContacts(items);
            }
        });

        replicationCollectionList.push({
            collectionName: this.serviceDataStorage.collectionName,
            async replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pullServices(updatedAt, id, batchSize);
            },
            async replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]> {
                return await replicaCanister.pushServices(items);
            }
        });

        await this.replicationProcessor.initReplication(replicationCollectionList);
    }
}
