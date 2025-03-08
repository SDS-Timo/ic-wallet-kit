import { EditHplVirtualAccountForm } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplMintCacheDataHandler, HplOwnerCacheDataHandler, HplVirtualAccountCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers";
import { CanisterService } from "@hpl/service";
import { HplVirtualAccount } from "@hpl/types";
import { getPrincipalGroupsQty } from "@hpl/utils/mintUtils";
import { BaseHandler, getPropertyName, getPxlCode, IdentifierService, ILogger, LoadType, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class EditHplVirtualAccountInternalHandler extends BaseHandler<
    EditHplVirtualAccountForm,
    HplVirtualAccount
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private canisterService: CanisterService,
        private hplVirtualAccountCacheDataHandler: HplVirtualAccountCacheDataHandler,
        private hplOwnerCacheDataHandler: HplOwnerCacheDataHandler,
        private hplMintCacheDataHandler: HplMintCacheDataHandler
    ) {
        super(logger);

    }

    validate(form: EditHplVirtualAccountForm): Promise<void> {
        if (form.virtualAccountId === undefined) {
            throw new ValidationError("editing.hpl.virtual.account.internal.virtualAccountId.is.required",
                getPropertyName(form, f => f.virtualAccountId),
                "Field virtualAccountId is required");
        }

        if (form.accountId === undefined) {
            throw new ValidationError("editing.hpl.virtual.account.internal.accountId.is.required",
                getPropertyName(form, f => f.accountId),
                "Field accountId is required");
        }

        if (form.amount === undefined) {
            throw new ValidationError("editing.hpl.virtual.account.internal.amount.is.required",
                getPropertyName(form, f => f.amount),
                "Field amount is required");
        }

        return Promise.resolve();
    }

    async process(form: EditHplVirtualAccountForm): Promise<HplVirtualAccount> {

        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );
        await ingressActorWrapper.updateVirtualAccount(
            form.virtualAccountId,
            form.accountId,
            form.amount,
            form.expiration
        );
        const hplData = await this.hplVirtualAccountCacheDataHandler.process({
            loadType: LoadType.Cache
        });
        const virtualAccountData = hplData.virtualAccounts.find((va) => va.virtualAccountId === form.virtualAccountId);
        if (!virtualAccountData) {
            throw new ValidationError("virtual.account.not.found", "virtualAccountId", "Virtual Account not found")
        }

        const accessByPrincipal = virtualAccountData.virtualAccountInfo.principal;
        const ownerData = await this.hplOwnerCacheDataHandler.process({
            principal: this.identifierService.getPrincipal(),
            loadType: LoadType.Cache
        });

        let mint = {
            canisterId: accessByPrincipal,
            isMinter: false
        }

        if (getPrincipalGroupsQty(accessByPrincipal.toString()) < 6) {
            mint = await this.hplMintCacheDataHandler.process({
                canisterId: accessByPrincipal,
                loadType: LoadType.Cache
            });
        }
        const result: HplVirtualAccount = {
            virtualAccountId: form.virtualAccountId,
            accountId: form.accountId,
            accessBy: accessByPrincipal.toString(),
            amount: form.amount,
            currencyAmount: "0.0",
            code: getPxlCode(ownerData.ownerId ? ownerData.ownerId.toString() : "", form.virtualAccountId),
            isMint: mint.isMinter,
            name: form.virtualAccountName,
            expiration: form.expiration,
            assetId: virtualAccountData.virtualAccountInfo.accountType.ft,
            assetSymbol: ""
        }
        return result;
    }


}
