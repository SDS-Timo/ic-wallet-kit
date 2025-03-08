import { ServiceAssetView } from "@icrc/types/services";

export interface LoadServiceAssetsResult {
    servicePrincipal: string;
    assets: ServiceAssetView[];
}
