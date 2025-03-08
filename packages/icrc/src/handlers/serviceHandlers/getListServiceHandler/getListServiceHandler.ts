import { BaseHandler, FormResult, ILogger, LoadType } from "@ic-wallet-kit/common";
import { SupportedAssetsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/supportedAssetsCacheHandler/supportedAssetsCacheHandler";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { LoadServiceAssetsHandler } from "@icrc/internalHandlers/service/loadServiceAssetsHandler";
import { buildAvailableAssetView } from "@icrc/maps/serviceMapper";
import { AssetRepository } from "@icrc/repositories";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { AvailableAssetView } from "@icrc/types";
import { GetServiceListForm, GetServiceListResult, LoadServiceAssetsForm, LoadServiceAssetsResult } from "@icrc/types/forms";
import { ServiceView } from "@icrc/types/services/serviceView";
import { Inject, Service } from "typedi";

@Service()
export class GetListServiceHandler extends BaseHandler<GetServiceListForm, GetServiceListResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ServiceRepository")
        private serviceRepository: ServiceRepository,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
        private getTokenSNSInternalHandler: GetTokenSNSCacheHandler,
        private supportedAssetsHandler: SupportedAssetsCacheHandler,
        private loadServiceAssetsHandler: LoadServiceAssetsHandler
    ) {
        super(logger);
    }

    public validate(form: GetServiceListForm): Promise<void> {
        return Promise.resolve();
    }

    public async process(form: GetServiceListForm): Promise<GetServiceListResult> {

        const result: GetServiceListResult = {
            services: [],
        };

        const serviceList = await this.serviceRepository.getServices();
        if (serviceList.length > 0) {
            const assets = await this.assetRepository.getTokensOrDefault();
            const tokenResult = await this.getTokenSNSInternalHandler.handle({ loadType: form.loadType });
            const tokens = tokenResult.data?.TokenList ?? [];

            const handlers: Promise<FormResult<LoadServiceAssetsResult>>[] = [];
            serviceList.forEach((service) => {
                const ledgerAddresses = service.assets.map((a) => a.ledgerAddress);
                const info: LoadServiceAssetsForm = {
                    servicePrincipal: service.principal,
                    ledgerAddresses: ledgerAddresses,
                    loadType: form.loadType
                };
                handlers.push(this.loadServiceAssetsHandler.handle(info));
            });
            const handlersResult = await Promise.all(handlers);
            for (const service of serviceList) {

                const supportedAssetResult = await this.supportedAssetsHandler.handle({
                    loadType: LoadType.Cache,
                    servicePrincipal: service.principal
                });
                const supportedAssets = supportedAssetResult.data?.principals ?? [];
                const availableAssets: AvailableAssetView[] = buildAvailableAssetView(
                    assets,
                    tokens,
                    supportedAssets
                );

                const serviceView: ServiceView = {
                    serviceAssets: [],
                    serviceName: service.name,
                    servicePrincipal: service.principal,
                    availableAssets: availableAssets,
                    isSync: false
                }
                const loadAssets = handlersResult.find((h) => h.isSuccess && h.data?.servicePrincipal === service.principal);
                const serviceAssets = loadAssets?.data?.assets || [];

                service.assets.forEach((assetData) => {
                    let assetView = serviceAssets.find((ast) => ast.ledgerAddress === assetData.ledgerAddress);

                    if (assetView) {
                        assetView.tokenName = assetData.tokenName;
                        assetView.tokenSymbol = assetData.tokenSymbol;
                        assetView.decimal = assetData.decimal;
                        assetView.shortDecimal = assetData.shortDecimal;
                        assetView.logo = assetData.logo ?? "";
                        assetView.isSync = true;
                    }
                    else {
                        assetView = {
                            ledgerAddress: assetData.ledgerAddress,
                            tokenName: assetData.tokenName,
                            tokenSymbol: assetData.tokenSymbol,
                            decimal: assetData.decimal,
                            shortDecimal: assetData.shortDecimal,
                            logo: assetData.logo ?? "",
                            balance: BigInt(0),
                            credit: BigInt(0),
                            depositFee: BigInt(0),
                            withdrawFee: BigInt(0),
                            isSync: false
                        }
                    }
                    serviceView.serviceAssets.push(assetView);
                })
                serviceView.isSync = serviceView.serviceAssets.every((a) => a.isSync)
                result.services.push(serviceView);
            };
        }
        return result;
    }
}
