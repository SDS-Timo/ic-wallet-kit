import { AmountProvider, BaseHandler, getPropertyName, ILogger, LoadType, ValidationError } from "@ic-wallet-kit/common";

import { AddIcrcAllowanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/addIcrcAllowanceHandler/addIcrcAllowanceHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AllowanceRepository } from "@icrc/repositories/persists/allowanceRepository/allowanceRepository";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { AddAllowanceForm } from "@icrc/types/forms/allowances/addAllowanceForm";

import { AssetManagerConfiguration } from "@icrc/types";
import { AllowanceResult } from "@icrc/types/forms/allowances/allowanceResult";
import { SupportedStandardEnum } from "@icrc/types/wallets/supportedStandardEnum";
import { convertDateStringToBigInt } from "@icrc/utils/dateTimeUtils";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class AddAllowanceHandler extends BaseHandler<AddAllowanceForm, AllowanceResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private assetMetaDataHandler: AssetMetaDataCacheHandler,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
        private allowanceRepository: AllowanceRepository,
        private addIcrcAllowanceHandler: AddIcrcAllowanceHandler,
        @Inject("AssetManagerConfiguration")
        private configuration: AssetManagerConfiguration,
        private subAccountBalanceHandler: SubAccountBalanceHandler
    ) {
        super(logger);
    }

    public async validate(form: AddAllowanceForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("adding.allowance.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        if (!form.spenderPrincipal) {
            throw new ValidationError("adding.allowance.spender.is.required",
                "spender",
                "Field spender is required");
        }

        if (!form.amount) {
            throw new ValidationError("adding.allowance.amount.is.required",
                "amount",
                "Field amount is required");
        }

        const isExist = await this.allowanceRepository.isExistStorageAllowance(
            form.spenderPrincipal,
            form.ledgerAddress,
            form.subAccountId.toString(),
            form.spenderSubId.toString()
        );

        if (isExist) {
            throw new ValidationError("adding.allowance.already.exists", "", "Allowance already exists");
        }

    }

    public async process(form: AddAllowanceForm): Promise<AllowanceResult> {

        let asset = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        });

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
            throw new ValidationError("amount.less.fee", "", "Amount should be more that ledger fee");
        }

        const isSupportedStandard = await this.assetRepository.checkSupportedStandard(form.ledgerAddress, SupportedStandardEnum.ICRC2)
        if (!isSupportedStandard) {
            throw new ValidationError("asset.not.supported.standard", "", "Asset not supported standard ICRC-2");
        }

        const expiration = convertDateStringToBigInt(form.expiration, this.configuration.defaultDateTimeFormat);

        const allowance = await this.addIcrcAllowanceHandler.process({
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccountId,
            spenderPrincipal: form.spenderPrincipal,
            spenderSubId: form.spenderSubId,
            amount: sentAmount,
            expiration: expiration
        });

        await this.allowanceRepository.addAllowance(form);

        return allowance;
    }


}