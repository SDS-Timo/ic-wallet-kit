import { ServiceAssetModel } from "@icrc/types/services/serviceAssetModel";

export interface ServiceModel {
    name: string;
    principal: string;
    assets: ServiceAssetModel[];
}
