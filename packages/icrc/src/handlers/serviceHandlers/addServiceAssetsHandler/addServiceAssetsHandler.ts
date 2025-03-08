import { BaseHandler, ILogger, LoadType } from "@ic-wallet-middleware/common";
import { LoadServiceAssetsHandler } from "@icrc/internalHandlers/service/loadServiceAssetsHandler";
import { AssetRepository } from "@icrc/repositories";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { AddServiceAssetListForm, AddServiceAssetListResult, LoadServiceAssetsForm } from "@icrc/types/forms";
import { ServiceAssetView } from "@icrc/types/services";
import { Inject, Service } from "typedi";

@Service()
export class AddServiceAssetsHandler extends BaseHandler<AddServiceAssetListForm, AddServiceAssetListResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ServiceRepository")
        private serviceRepository: ServiceRepository,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
        private loadServiceAssetsHandler: LoadServiceAssetsHandler,
    ) {
        super(logger);
    }

    public validate(form: AddServiceAssetListForm): Promise<void> {
        return Promise.resolve();
    }

    public async process(form: AddServiceAssetListForm): Promise<AddServiceAssetListResult> {
        const assetList = await this.assetRepository.getTokensOrDefault()
        const existAssets = assetList.filter((a) => form.ledgerAddresses.includes(a.ledgerAddress)).map((a) => {
            return {
                ledgerAddress: a.ledgerAddress,
                tokenName: a.name,
                tokenSymbol: a.symbol,
                decimal: a.shortDecimal,
                shortDecimal: a.shortDecimal,
                logo: a.logo
            }
        });
        const info: LoadServiceAssetsForm = {
            servicePrincipal: form.servicePrincipal,
            ledgerAddresses: form.ledgerAddresses,
            loadType: LoadType.Quick
        };
        const loadAssets = await this.loadServiceAssetsHandler.handle(info)
        const assets = loadAssets?.data?.assets || [];
        const serviceAssets: ServiceAssetView[] = [];
        const assetModels = await this.serviceRepository.addServiceAssets(form.servicePrincipal, existAssets);
        assetModels.forEach((assetData) => {
            let assetView = assets.find((ast) => ast.ledgerAddress === assetData.ledgerAddress);
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
            serviceAssets.push(assetView);
        })
        return {
            assets: serviceAssets
        };
    }


}
