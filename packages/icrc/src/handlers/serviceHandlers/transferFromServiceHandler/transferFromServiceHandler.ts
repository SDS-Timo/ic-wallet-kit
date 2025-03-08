import { AmountProvider, BaseHandler, ILogger, IdentifierService, LoadType, ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceAssetDetailsHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { TransferFromServiceResult } from "@icrc/types/forms";
import { TransferFromServiceForm } from "@icrc/types/forms/transfers/transferFromServiceForm";
import { Icrc84ActorWrapper } from "@icrc/wrappers";
import { Inject, Service } from "typedi";

@Service()
export class TransferFromServiceHandler extends BaseHandler<TransferFromServiceForm, TransferFromServiceResult> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private assetMetaDataHandler: AssetMetaDataCacheHandler,
        private serviceAssetDetailsHandler: ServiceAssetDetailsHandler,
        private serviceAssetCreditHandler: ServiceAssetCacheCreditHandler,
        private serviceAssetDepositHandler: ServiceAssetDepositHandler,
        private identifierService: IdentifierService,
        private subAccountBalanceHandler: SubAccountBalanceHandler
    ) {
        super(logger);
    }

    public validate(form: TransferFromServiceForm): Promise<void> {

        if (!form.fromPrincipal) {
            throw new ValidationError("transfer.service.fromPrincipal.is.required",
                getPropertyName(form, (v) => v.fromPrincipal),
                "Field fromPrincipal is required");
        }

        if (!form.ledgerAddress) {
            throw new ValidationError("transfer.service.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        if (!form.toPrincipal) {
            throw new ValidationError("transfer.service.toPrincipal.is.required",
                getPropertyName(form, (v) => v.fromPrincipal),
                "Field toPrincipal is required");
        }

        return Promise.resolve();

    }

    public async process(form: TransferFromServiceForm): Promise<TransferFromServiceResult> {

        let asset = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        });

        if (!asset) {
            throw new ValidationError("asset.not.found",
                getPropertyName(form, f => f.fromPrincipal),
                "Asset Not Found");
        }

        const serviceAssetCredit = await this.serviceAssetCreditHandler.process({
            servicePrincipal: form.fromPrincipal,
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        })

        const serviceAssetDetails = (await this.serviceAssetDetailsHandler.process({
            servicePrincipal: form.fromPrincipal,
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        })).assetDetail;

        const sentAmount = AmountProvider.toBigInt(form.amount, asset.decimals);

        if (!sentAmount) {
            throw new ValidationError("transfer.service.invalid.amount", getPropertyName(form, f => f.amount), "Invalid amount");
        }

        if (sentAmount <= 0) {
            throw new ValidationError("transfer.less.amount",
                "amount",
                "Amount should be more that 0");
        }

        if (sentAmount <= serviceAssetDetails.withdrawalFee) {
            throw new ValidationError("transfer.amount.less.minimum.withdrawal",
                "amount",
                `Amount should be more that withdrawal fee: ${serviceAssetDetails.withdrawalFee}`);
        }

        if (sentAmount > serviceAssetCredit.credit) {
            throw new ValidationError("transfer.from.no.enough.balance",
                "amount",
                "Sent amount should be less than balance");
        }

        const ledgerWrapper = Icrc84ActorWrapper.create(this.identifierService.getAgent(), form.fromPrincipal);

        await ledgerWrapper.withdraw(
            form.toPrincipal,
            form.ledgerAddress,
            [form.toSubId.toUint8Array()],
            sentAmount,
            []
        );

        const assetCredit = await this.serviceAssetCreditHandler.process({
            servicePrincipal: form.fromPrincipal,
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Full
        })
        const assetDeposit = await this.serviceAssetDepositHandler.process({
            servicePrincipal: form.fromPrincipal,
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Full
        })
        if (this.identifierService.getPrincipalStr() === form.toPrincipal) {
            this.subAccountBalanceHandler.handle({
                ledgerAddress: form.ledgerAddress,
                subAccountId: form.toSubId,
                loadType: LoadType.Full
            })

        }
        return {
            servicePrincipal: form.fromPrincipal,
            ledgerAddress: assetCredit.ledgerAddress,
            credit: assetCredit.credit,
            deposit: assetDeposit.serviceAssetDeposit
        }
    }


}