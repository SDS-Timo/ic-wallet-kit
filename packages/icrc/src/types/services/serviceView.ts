import { AvailableAssetView } from "@icrc/types/services/availableAssetView";
import { ServiceAssetView } from "@icrc/types/services/serviceAssetView";

export interface ServiceView {
    serviceName: string;
    servicePrincipal: string;
    serviceAssets: ServiceAssetView[];
    availableAssets: AvailableAssetView[];
    isSync: boolean;
};