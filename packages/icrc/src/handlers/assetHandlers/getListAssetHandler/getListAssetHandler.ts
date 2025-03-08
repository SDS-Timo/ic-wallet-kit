import { BaseHandler, FormResult, ILogger } from "@ic-wallet-middleware/common";
import { LoadAssetHandler } from "@icrc/internalHandlers/loadAssetHandler/loadAssetHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { AssetICRC, AssetView, SubAccountId } from "@icrc/types";
import { AssetManagerConfiguration } from "@icrc/types/configuration/assetManagerConfiguration";
import { GetAssetListForm, GetAssetListResult, LoadAssetForm } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class GetListAssetHandler extends BaseHandler<GetAssetListForm, GetAssetListResult> {
    protected configuration: AssetManagerConfiguration;
    private assetRepository: AssetRepository;
    private loadAssetHandler: LoadAssetHandler;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetManagerConfiguration")
        configuration: AssetManagerConfiguration,
        @Inject("AssetRepository")
        assetRepository: AssetRepository,
        loadAssetHandler: LoadAssetHandler,
    ) {
        super(logger);
        this.configuration = configuration;
        this.assetRepository = assetRepository;
        this.loadAssetHandler = loadAssetHandler;
    }

    public validate(form: GetAssetListForm): Promise<void> {
        return Promise.resolve();
    }

    public async process(form: GetAssetListForm): Promise<GetAssetListResult> {

        const result: GetAssetListResult = {
            assets: [],
        };

        const assetList = await this.assetRepository.getTokensOrDefault();

        const handlers: Promise<FormResult<AssetICRC>>[] = [];
        assetList.forEach((walletAsset) => {
            const info: LoadAssetForm = {
                ledgerAddress: walletAsset.ledgerAddress,
                indexAddress: walletAsset.indexAddress,
                subAccounts: walletAsset.subAccounts.map((sa) => SubAccountId.parseFromString(sa.subAccountId)),
                loadType: form.loadType,
            };
            handlers.push(this.loadAssetHandler.handle(info));
        });
        const handlersResult = await Promise.all(handlers);
        for (let asset of assetList) {
            const assetView: AssetView = {
                ledgerAddress: asset.ledgerAddress,
                indexAddress: asset.indexAddress,
                name: asset.name,
                tokenName: asset.tokenName,
                sortOrder: asset.sortOrder,
                decimal: 0,
                logo: asset.logo,
                subAccounts: asset.subAccounts.map((sa) => {
                    return {
                        ledgerAddress: sa.ledgerAddress,
                        name: sa.name,
                        balance: BigInt(0),
                        currencyAmount: "",
                        decimal: 0,
                        subAccountId: SubAccountId.parseFromString(sa.subAccountId),
                        isSync: false,
                    };
                }),
                symbol: asset.symbol,
                tokenSymbol: asset.tokenSymbol,
                shortDecimal: asset.shortDecimal,
                transactionFee: BigInt(0),
                supportedStandards: asset.supportedStandards,
                isSync: false,
            };

            const failedResults = handlersResult.filter((h) => !h.isSuccess);
            if (failedResults.length > 0) {
                const errors = failedResults.flatMap((x) => x.errors);
                throw errors;
            }
            const loadAsset = handlersResult.find((h) => h.isSuccess && h.data?.ledgerAddress == asset.ledgerAddress);
            if (loadAsset) {
                assetView.transactionFee = loadAsset.data!.transactionFee;
                assetView.decimal = loadAsset.data!.decimal;
                assetView.isSync = true;
                for (let loadSubAccount of loadAsset.data!.subAccounts) {
                    const subAccount = assetView.subAccounts.find((x) => x.subAccountId.equals(loadSubAccount.subAccountId));
                    if (subAccount) {
                        subAccount.balance = loadSubAccount.balance;
                        subAccount.currencyAmount = loadSubAccount.currencyAmount;
                        subAccount.decimal = loadAsset.data!.decimal;
                        subAccount.isSync = true;
                    }
                    else {
                        loadSubAccount.name = "-";
                        loadSubAccount.decimal = loadAsset.data!.decimal;
                        loadSubAccount.isSync = true;

                        assetView.subAccounts.push(loadSubAccount);
                        await this.assetRepository.addSubAccount({
                            ledgerAddress: loadSubAccount.ledgerAddress,
                            subAccountId: loadSubAccount.subAccountId.toString(),
                            name: loadSubAccount.name
                        })
                    }
                };
            }
            result.assets.push(assetView);
        };

        return result;
    }


}
