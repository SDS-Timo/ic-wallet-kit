import { AmountProvider, BaseHandler, ILogger, IdentifierService, LoadType, ValidationError, getPropertyName } from "@ic-wallet-middleware/common";

import { GetAllowanceSubAccountBalanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getAllowanceSubAccountBalanceCacheHandler/getAllowanceSubAccountBalanceCacheHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { AllowanceResult } from "@icrc/types/forms/allowances/allowanceResult";
import { TransferFromAllowanceForm } from "@icrc/types/forms/transfers/transferFromAllowanceForm";
import { SupportedStandardEnum } from "@icrc/types/wallets/supportedStandardEnum";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class TransferFromAllowanceHandler extends BaseHandler<TransferFromAllowanceForm, AllowanceResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private assetMetaDataHandler: AssetMetaDataCacheHandler,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
        private getAllowanceSubAccountBalanceHandler: GetAllowanceSubAccountBalanceCacheHandler
    ) {
        super(logger);
    }

    public validate(form: TransferFromAllowanceForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("transfer.allowance.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        if (!form.receiverPrincipal) {
            throw new ValidationError("transfer.allowance.receiverPrincipal.is.required",
                "receiverPrincipal",
                "Field receiverPrincipal is required");
        }

        if (!form.toSubAccountId) {
            throw new ValidationError("transfer.allowance.toSubAccountId.is.required",
                "toSubAccountId",
                "Field toSubAccountId is required");
        }

        if (!form.senderPrincipal) {
            throw new ValidationError("transfer.allowance.senderPrincipal.is.required",
                "senderPrincipal",
                "Field senderPrincipal is required");
        }

        if (!form.fromSubAccountId) {
            throw new ValidationError("transfer.allowance.fromSubAccountId.is.required",
                "fromSubAccountId",
                "Field fromSubAccountId is required");
        }

        if (!form.amount) {
            throw new ValidationError("transfer.allowance.amount.is.required",
                "amount",
                "Field transferAmount is required");
        }

        return Promise.resolve();
    }

    public async process(form: TransferFromAllowanceForm): Promise<AllowanceResult> {
        const isSupportedStandard = await this.assetRepository.checkSupportedStandard(form.ledgerAddress, SupportedStandardEnum.ICRC2)
        if (!isSupportedStandard) {
            throw new ValidationError("asset.not.supported.standard", "", "Asset not supported standard ICRC-2");
        }

        let asset = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        });

        if (!asset) {
            throw new ValidationError("asset.not.found",
                getPropertyName(form, f => f.ledgerAddress),
                "Asset Not Found");
        }

        const fromSubAccountId = form.fromSubAccountId;
        const toSubAccountId = form.toSubAccountId;
        const sentAmount = AmountProvider.toBigInt(form.amount, asset.decimals);

        if (!sentAmount) {
            throw new ValidationError("transfer.allowance.invalid.amount", getPropertyName(form, f => f.amount), "Invalid amount");
        }
        const subAccountBalance = await this.getAllowanceSubAccountBalanceHandler.handle({
            principal: form.senderPrincipal.toText(),
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Full,
            subAccountId: fromSubAccountId
        });

        if (subAccountBalance.balance - asset.fee < sentAmount) {
            throw new ValidationError("balance.less.amount",
                "transferAmount",
                "The sent amount should be lees that the balance");
        }

        const ledgerWrapper = LedgerWrapper.create(this.identifierService.getAgent(), form.ledgerAddress)

        await ledgerWrapper.transferFrom({
            amount: sentAmount,
            fromAccountPrincipal: form.senderPrincipal,
            fromSubAccountId: fromSubAccountId,
            toSubAccountId: toSubAccountId,
            toAccountPrincipal: form.receiverPrincipal
        });

        //TODO: make sure that need reload balances ???

        return {}
    }
}