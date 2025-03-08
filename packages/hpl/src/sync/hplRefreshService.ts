import { GetHplAccountListHandler, GetHplAssetListHandler, GetHplVirtualAccountListHandler } from "@hpl/handlers";
import { GetHplContactListHandler } from "@hpl/handlers/contacts/getHplContactListHandler/getHplContactListHandler";
import { HplRxSyncStateService } from "@hpl/replications/hplRxSyncStateService";

import { LoadType, RefreshServiceBase, RefreshServiceConfiguration } from "@ic-wallet-kit/common";
import { Inject, Service } from "typedi";

@Service()
export class HplRefreshService extends RefreshServiceBase {
    protected configuration: RefreshServiceConfiguration;

    constructor(
        private getHplAssetListHandler: GetHplAssetListHandler,
        private getHplAccountListHandler: GetHplAccountListHandler,
        private getHplVirtualAccountListHandler: GetHplVirtualAccountListHandler,
        private getHplContactListHandler: GetHplContactListHandler,
        @Inject("RefreshServiceConfiguration")
        configuration: RefreshServiceConfiguration,
        rxSyncStateService: HplRxSyncStateService
    ) {
        super(configuration, rxSyncStateService);
        this.configuration = configuration;
    }


    async runSync(): Promise<Boolean> {
        let assetListResult = await this.getHplAssetListHandler.handle({ loadType: LoadType.Full });

        let isSuccess = assetListResult.isSuccess;

        let accountListResult = await this.getHplAccountListHandler.handle({ loadType: LoadType.Full });

        isSuccess = accountListResult.isSuccess && isSuccess;

        let virtualAccountListResult = await this.getHplVirtualAccountListHandler.handle({ loadType: LoadType.Full });

        isSuccess = virtualAccountListResult.isSuccess && isSuccess;

        const contactListResult = await this.getHplContactListHandler.handle({ loadType: LoadType.Full });

        isSuccess = contactListResult.isSuccess && isSuccess;

        return isSuccess;
    }
}