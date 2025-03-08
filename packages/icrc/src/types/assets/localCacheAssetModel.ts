import { LocalCacheSubAccountModel } from "./localCacheSubAccountModel";
import { MetadataInfo } from "./metadataInfo";


export interface LocalCacheAssetModel {
    ledgerAddress: string;
    metaData?: MetadataInfo;
    transactionFee?: bigint;
    subAccounts: LocalCacheSubAccountModel[];
}
