import { LoadType, RefreshServiceBase, RefreshServiceConfiguration } from "@ic-wallet-middleware/common";
import { GetListAllowanceHandler, GetListAssetHandler, GetListContactHandler, GetListServiceHandler } from "@icrc/handlers";
import { IcrcRxSyncStateService } from "@icrc/replications";
import { Inject, Service } from "typedi";

@Service()
export class IcrcRefreshService extends RefreshServiceBase {
    protected configuration: RefreshServiceConfiguration;

    constructor(
        private getListAssetHandler: GetListAssetHandler,
        private getListAllowanceHandler: GetListAllowanceHandler,
        private getListContactHandler: GetListContactHandler,
        private getListServiceHandler: GetListServiceHandler,
        @Inject("RefreshServiceConfiguration")
        configuration: RefreshServiceConfiguration,
        rxSyncStateService: IcrcRxSyncStateService
    ) {
        super(configuration, rxSyncStateService);
        this.configuration = configuration;
    }


    async runSync(): Promise<Boolean> {
        let assetListResult = await this.getListAssetHandler.handle({ loadType: LoadType.Full });

        let isSuccess = assetListResult.isSuccess;

        if (assetListResult.isSuccess && assetListResult.data) {
            for (const asset of assetListResult.data.assets) {
                const getAllowanceListResult = await this.getListAllowanceHandler.handle({
                    loadType: LoadType.Full, ledgerAddress: asset.ledgerAddress
                });

                isSuccess = getAllowanceListResult.isSuccess && isSuccess;
            }
        }

        const contactListResult = await this.getListContactHandler.handle({ loadType: LoadType.Full });

        isSuccess = contactListResult.isSuccess && isSuccess;

        const serviceListResult = await this.getListServiceHandler.handle({ loadType: LoadType.Full });

        isSuccess = serviceListResult.isSuccess && isSuccess;

        return isSuccess;
    }
}