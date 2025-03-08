import { AmountProvider, BaseHandler, ILogger, IdentifierService, LoadType, ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { allowanceCacheModelToDataModel, allowanceFormToCache } from "@icrc/maps/allowanceMapper";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AllowanceCacheModel, AssetManagerConfiguration, SubAccountId } from "@icrc/types";
import { UpdateAllowanceForm, UpdateAllowanceResult } from "@icrc/types/forms";
import { convertDateStringToBigInt } from "@icrc/utils/dateTimeUtils";
import { LedgerWrapper } from "@icrc/wrappers";
import { Inject, Service } from "typedi";

@Service()
export class UpdateAllowanceHandler extends BaseHandler<UpdateAllowanceForm, UpdateAllowanceResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private assetMetaDataHandler: AssetMetaDataCacheHandler,
        private allowanceLocalCache: AllowanceLocalCache,
        private subAccountBalanceHandler: SubAccountBalanceHandler,
        @Inject("AssetManagerConfiguration")
        private configuration: AssetManagerConfiguration
    ) {
        super(logger);
    }

    public validate(form: UpdateAllowanceForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("update.allowance.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        if (!form.spenderPrincipal) {
            throw new ValidationError("update.allowance.spender.is.required",
                "spender",
                "Field spender is required");
        }

        if (!form.subAccountId) {
            throw new ValidationError("update.allowance.subAccountId.is.required",
                "subAccountId",
                "Field subAccountId is required");
        }

        if (!form.amount) {
            throw new ValidationError("update.allowance.amount.is.required",
                "amount",
                "Field amount is required");
        }

        return Promise.resolve();
    }

    public async process(form: UpdateAllowanceForm): Promise<UpdateAllowanceResult> {

        let asset = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        });
        if (!asset) {
            throw new ValidationError("asset.not.found",
                getPropertyName(form, f => f.ledgerAddress),
                "Asset Not Found");
        }

        const subAccountBalance = await this.subAccountBalanceHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Full,
            subAccountId: form.subAccountId
        });

        if (subAccountBalance.balance < asset.fee) {

            throw new ValidationError("balance.less.fee",
                "",
                "Balance should be more that ledger fee");
        }

        const sentAmount = AmountProvider.toBigInt(form.amount, asset.decimals);

        if (!sentAmount) {
            throw new ValidationError("transfer.allowance.invalid.amount", getPropertyName(form, f => f.amount), "Invalid amount");
        }


        if (sentAmount < asset.fee) {
            throw new ValidationError("amount.less.fee",
                "",
                "Amount should be more that ledger fee");
        }

        const expiration = convertDateStringToBigInt(form.expiration, this.configuration.defaultDateTimeFormat);

        const cache: AllowanceCacheModel = allowanceFormToCache(form, sentAmount, expiration);

        const model = allowanceCacheModelToDataModel(cache);

        await LedgerWrapper.approveAllowance(model, this.identifierService.getAgent());

        this.allowanceLocalCache.updateOrAddAllowance(cache);

        return {
            ledgerAddress: cache.ledgerAddress,
            subAccountId: SubAccountId.parseFromString(cache.subAccountId),
            spenderPrincipal: cache.spenderPrincipal,
            spenderSubId: SubAccountId.parseFromString(cache.spenderSubId),
            amount: cache.amount,
            expiration: form.expiration
        };

    }


}