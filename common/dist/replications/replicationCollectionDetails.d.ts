import { BaseRxDbDocument } from "@common/storage";
export interface ReplicationCollectionDetails {
    collectionName: string;
    replicationPull(replicaCanister: any, updatedAt: any, id: any[], batchSize: any): Promise<BaseRxDbDocument[]>;
    replicationPush(replicaCanister: any, items: any[]): Promise<BaseRxDbDocument[]>;
}
