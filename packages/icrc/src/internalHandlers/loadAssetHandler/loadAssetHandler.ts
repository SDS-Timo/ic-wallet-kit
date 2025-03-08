import { ILogger } from "@ic-wallet-middleware/common";
import { BaseInternalHandler } from "@icrc/internalHandlers/baseInternalHandler/baseInternalHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AssetTransactionFeeCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetTransactionFeeCacheHandler/assetTransactionFeeCacheHandler";
import { GetTokenMarketCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AssetICRC, AssetSubAccountView, TokenMarketInfo } from "@icrc/types";
import { LoadAssetForm } from "@icrc/types/forms/assets/loadAssetForm";
import { Inject, Service } from "typedi";

@Service()
export class LoadAssetHandler extends BaseInternalHandler<
    LoadAssetForm,
    AssetICRC
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private assetMetaDateHandler: AssetMetaDataCacheHandler,
        private assetTransactionFeeHandler: AssetTransactionFeeCacheHandler,
        protected subAccountBalanceHandler: SubAccountBalanceHandler,
        private getTokenMarketCacheHandler: GetTokenMarketCacheHandler
    ) {
        super(logger, subAccountBalanceHandler);
    }

    async validate(form: LoadAssetForm): Promise<void> { }

    async process(form: LoadAssetForm): Promise<AssetICRC> {
        const assetInfo = {
            ledgerAddress: form.ledgerAddress,
            indexAddress: form.indexAddress,
            loadType: form.loadType,
        };

        const [metadataResult, transactionFeeResult] = await Promise.all([
            this.assetMetaDateHandler.handle(assetInfo),
            this.assetTransactionFeeHandler.handle(assetInfo),
        ]);

        const result: AssetICRC = {
            ledgerAddress: form.ledgerAddress,
            indexAddress: form.indexAddress,
            subAccounts: [],
            decimal: 0,
            logo: undefined,
            isSync: true,
            transactionFee: BigInt(0),
            tokenName: "",
            tokenSymbol: "",
        };

        result.tokenSymbol = metadataResult.symbol;
        result.tokenName = metadataResult.name;
        result.decimal = metadataResult.decimals;
        result.logo = metadataResult.logo;

        result.transactionFee = transactionFeeResult.transactionFee;

        const tokenMarketResult = await this.getTokenMarketCacheHandler.handle({ loadType: form.loadType });
        let assetMarket: TokenMarketInfo | undefined = undefined;
        if (tokenMarketResult.isSuccess) {
            assetMarket = tokenMarketResult.data?.markets.find(
                (tm) => tm.symbol === metadataResult.symbol
            );
        }

        const subAccts: AssetSubAccountView[] = await Promise.all(
            form.subAccounts.map(async (sa) => {
                const subAcc = await this.getSubAccountById(
                    sa,
                    form,
                    assetMarket,
                    metadataResult.decimals);
                return subAcc;
            }),
        );

        result.subAccounts = subAccts;
        return result;
    }

}
