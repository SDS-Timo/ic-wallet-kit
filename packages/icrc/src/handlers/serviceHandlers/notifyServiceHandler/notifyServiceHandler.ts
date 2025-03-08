import { BaseHandler, ILogger, IdentifierService, LoadType, ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { NotifyForm, NotifyResult } from "@icrc/types/forms";
import { Icrc84ActorWrapper } from "@icrc/wrappers";
import { Inject, Service } from "typedi";

@Service()
export class NotifyServiceHandler extends BaseHandler<NotifyForm, NotifyResult> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private serviceAssetCreditHandler: ServiceAssetCacheCreditHandler,
        private serviceAssetDepositHandler: ServiceAssetDepositHandler
    ) {
        super(logger);
    }

    public validate(form: NotifyForm): Promise<void> {
        if (!form.servicePrincipal) {
            throw new ValidationError("notify.service.servicePrincipal.is.required",
                getPropertyName(form, (v) => v.servicePrincipal),
                "Field servicePrincipal is required");
        }

        if (!form.ledgerAddress) {
            throw new ValidationError("notify.service.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        return Promise.resolve();
    }

    public async process(form: NotifyForm): Promise<NotifyResult> {

        const ledgerWrapper = Icrc84ActorWrapper.create(this.identifierService.getAgent(), form.servicePrincipal);

        await ledgerWrapper.notify(
            form.ledgerAddress
        );
        const assetCredit = await this.serviceAssetCreditHandler.process({
            servicePrincipal: form.servicePrincipal,
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Full
        })
        const assetDeposit = await this.serviceAssetDepositHandler.process({
            servicePrincipal: form.servicePrincipal,
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Full
        })
        return {
            servicePrincipal: form.servicePrincipal,
            ledgerAddress: assetCredit.ledgerAddress,
            credit: assetCredit.credit,
            deposit: assetDeposit.serviceAssetDeposit
        }
    }


}