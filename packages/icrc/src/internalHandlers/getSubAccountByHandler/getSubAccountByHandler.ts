import { ILogger } from "@ic-wallet-middleware/common";
import { BaseInternalHandler } from "@icrc/internalHandlers/baseInternalHandler/baseInternalHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { GetTokenMarketCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AssetSubAccount, TokenMarketInfo } from "@icrc/types";
import { GetSubAccountForm } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class GetSubAccountByHandler extends BaseInternalHandler<
    GetSubAccountForm,
    AssetSubAccount
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private assetMetaDateHandler: AssetMetaDataCacheHandler,
        protected subAccountBalanceHandler: SubAccountBalanceHandler,
        private getTokenMarketCacheHandler: GetTokenMarketCacheHandler
    ) {
        super(logger, subAccountBalanceHandler);
    }

    async validate(form: GetSubAccountForm): Promise<void> { }

    async process(form: GetSubAccountForm): Promise<AssetSubAccount> {

        const assetInfo = {
            ledgerAddress: form.ledgerAddress,
            loadType: form.loadType,
        };
        const metadataResult = await this.assetMetaDateHandler.handle(assetInfo);

        const symbol = metadataResult.symbol;

        const tokenMarketResult = await this.getTokenMarketCacheHandler.handle({ loadType: form.loadType });
        let assetMarket: TokenMarketInfo | undefined = undefined;
        if (tokenMarketResult.isSuccess) {
            assetMarket = tokenMarketResult.data?.markets.find(
                (tm) => tm.symbol === symbol
            );
        }

        const decimal = metadataResult.decimals;

        const result = await this.getSubAccountById(form.subAccountId, form, assetMarket, decimal);

        return result;
    }

}
