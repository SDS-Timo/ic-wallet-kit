import { BaseHandler, IFormError, ILogger } from "@ic-wallet-kit/common";
import { IcrcCacheBalanceErrorKey, IcrcCacheMetadataErrorKey, IcrcCacheTransactionFeeErrorKey } from "@icrc/errors/cacheErrorMessages";
import { getCurrencyAmount } from "@icrc/extensions/currencyExtension";
import { SubAccountBalanceHandler, SubAccountBalanceInfo } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AssetSubAccountView, SubAccountId, TokenMarketInfo } from "@icrc/types";
import { AccountDefaultEnum } from "@icrc/types/enums";
import { InternalHandlerForm } from "@icrc/types/forms/internalHandlerForm";
import { Inject } from "typedi";

export abstract class BaseInternalHandler<TForm extends InternalHandlerForm, TResult> extends BaseHandler<TForm, TResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        protected subAccountBalanceHandler: SubAccountBalanceHandler,
    ) {
        super(logger);
    }

    abstract validate(form: TForm): Promise<void>;

    abstract process(form: TForm): Promise<TResult>;

    protected async getSubAccountById(
        subAccountId: SubAccountId,
        form: TForm,
        assetMarket: TokenMarketInfo | undefined,
        decimal: number): Promise<AssetSubAccountView> {
        const result: AssetSubAccountView = {
            subAccountId: subAccountId,
            ledgerAddress: form.ledgerAddress,
            currencyAmount: "",
            balance: BigInt(0),
            decimal: decimal,
            name: "",
            isSync: false
        };

        const info: SubAccountBalanceInfo = {
            ledgerAddress: form.ledgerAddress,
            subAccountId: subAccountId,
            loadType: form.loadType
        };

        const balanceResult = await this.subAccountBalanceHandler.handle(info);

        result.name =
            subAccountId.equals(SubAccountId.Default())
                ? AccountDefaultEnum[AccountDefaultEnum.Default]
                : "-";

        const currencyAmount = getCurrencyAmount(
            assetMarket,
            balanceResult.balance,
            decimal
        );

        result.balance = balanceResult.balance;
        result.currencyAmount = currencyAmount;
        result.isSync = true;

        return result;
    }

    public parseError<T>(errors: IFormError[]) {
        const cacheDataError = errors.find((e) => e.localizationKey === IcrcCacheMetadataErrorKey
            || e.localizationKey === IcrcCacheTransactionFeeErrorKey
            || e.localizationKey === IcrcCacheBalanceErrorKey)
        if (cacheDataError) {
            return;
        }
        throw errors;
    }
}
