import { LocalCacheServiceAssetModel } from "@icrc/types/services/localCacheServiceAssetModel";

export interface LocalCacheServiceModel {
    servicePrincipal: string;
    assets: LocalCacheServiceAssetModel[];
}
