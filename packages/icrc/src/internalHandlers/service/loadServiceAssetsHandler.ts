import { BaseHandler, ILogger } from "@ic-wallet-middleware/common";
import { AllCreditsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/allCreditsCacheHandler/allCreditsCacheHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceAssetDetailsHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { LoadServiceAssetsForm, LoadServiceAssetsResult } from "@icrc/types/forms";
import { ServiceAssetView } from "@icrc/types/services";
import { Inject, Service } from "typedi";

@Service()
export class LoadServiceAssetsHandler extends BaseHandler<
    LoadServiceAssetsForm,
    LoadServiceAssetsResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private allCreditsHandler: AllCreditsCacheHandler,
        private serviceAssetDetailsHandler: ServiceAssetDetailsHandler,
        private serviceAssetDepositHandler: ServiceAssetDepositHandler
    ) {
        super(logger);
    }

    async validate(form: LoadServiceAssetsForm): Promise<void> { }

    async process(form: LoadServiceAssetsForm): Promise<LoadServiceAssetsResult> {
        const serviceInfo = {
            servicePrincipal: form.servicePrincipal,
            loadType: form.loadType
        };
        let serviceAssets: ServiceAssetView[] = [];
        const allCreditsResult = await this.allCreditsHandler.process(serviceInfo);

        serviceAssets = await Promise.all(form.ledgerAddresses.map(async (ledgerAddress) => {
            const detailsInfo = {
                servicePrincipal: form.servicePrincipal,
                ledgerAddress: ledgerAddress,
                loadType: form.loadType
            }
            const assetDetailsResult = await this.serviceAssetDetailsHandler.process(detailsInfo);
            const credit = allCreditsResult.credits.find((crd) => crd.ledgerAddress === ledgerAddress);
            const assetDepositResult = await this.serviceAssetDepositHandler.process(detailsInfo);
            const serviceAsset: ServiceAssetView = {
                tokenSymbol: "",
                tokenName: "",
                logo: "",
                decimal: undefined,
                shortDecimal: undefined,
                balance: assetDepositResult.serviceAssetDeposit,
                ledgerAddress: ledgerAddress,
                credit: credit?.credit,
                depositFee: assetDetailsResult.assetDetail.depositFee,
                withdrawFee: assetDetailsResult.assetDetail.withdrawalFee,
                isSync: true
            };
            return serviceAsset;
        }))

        const result: LoadServiceAssetsResult = {
            servicePrincipal: form.servicePrincipal,
            assets: serviceAssets
        };
        return result;
    }

}
