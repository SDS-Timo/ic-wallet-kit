import { Principal } from "@dfinity/principal";
import { AmountProvider, BaseHandler, ILogger, IdentifierService, LoadType, ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { TransferForm, TransferToServiceResult } from "@icrc/types/forms";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import { Inject, Service } from "typedi";

@Service()
export class TransferToServiceHandler extends BaseHandler<TransferForm, TransferToServiceResult> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private assetMetaDataHandler: AssetMetaDataCacheHandler,
        private identifierService: IdentifierService,
        private getSubAccountByHandler: GetSubAccountByHandler
    ) {
        super(logger);
    }

    public validate(form: TransferForm): Promise<void> {
        if (!form.fromPrincipal) {
            throw new ValidationError("transfer.to.service.fromPrincipal.is.required",
                getPropertyName(form, (v) => v.fromPrincipal),
                "Field fromPrincipal is required");
        }

        if (!form.toPrincipal) {
            throw new ValidationError("transfer.to.service.toPrincipal.is.required",
                getPropertyName(form, (v) => v.fromPrincipal),
                "Field toPrincipal is required");
        }

        return Promise.resolve();
    }

    public async process(form: TransferForm): Promise<TransferToServiceResult> {

        let asset = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.fromPrincipal,
            loadType: LoadType.Quick
        });

        if (!asset) {
            throw new ValidationError("asset.not.found",
                getPropertyName(form, f => f.fromPrincipal),
                "Asset Not Found");
        }

        const sentAmount = AmountProvider.toBigInt(form.amount, asset.decimals);

        if (!sentAmount) {
            throw new ValidationError("transfer.service.invalid.amount", getPropertyName(form, f => f.amount), "Invalid amount");
        }

        const subAccount = await this.getSubAccountByHandler.handle({
            ledgerAddress: form.fromPrincipal,
            loadType: LoadType.Quick,
            subAccountId: form.fromSubId
        });

        if (sentAmount > 0) {
            if ((subAccount.data?.balance ?? BigInt(0)) - asset.fee < sentAmount) {
                throw new ValidationError("balance.less.amount",
                    "sentAmount",
                    "Sent amount should be less than balance");
            }
        }
        else {
            throw new ValidationError("balance.less.amount",
                "sentAmount",
                "Amount should be more that 0");
        }

        const ledgerWrapper = LedgerWrapper.create(this.identifierService.getAgent(), form.fromPrincipal);

        await ledgerWrapper.transfer({
            amount: sentAmount,
            fromSubAccountId: form.fromSubId,
            toAccountPrincipal: Principal.fromText(form.toPrincipal),
            toSubAccountId: form.toSubId
        });

        return {};
    }
}