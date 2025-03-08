
import { EmptyHplResult, ResetHplVirtualAccountForm } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplVirtualAccountStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplVirtualAccountStateCacheDataHandler/hplVirtualAccountStateCacheDataHandler";
import { CanisterService } from "@hpl/service";
import { BaseHandler, getPropertyName, IdentifierService, ILogger, LoadType, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class ResetHplVirtualAccountInternalHandler extends BaseHandler<
    ResetHplVirtualAccountForm,
    EmptyHplResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private canisterService: CanisterService,
        private hplVirtualAccountStateCacheDataHandler: HplVirtualAccountStateCacheDataHandler
    ) {
        super(logger);
    }

    validate(form: ResetHplVirtualAccountForm): Promise<void> {
        if (form.virtualAccountId === undefined) {
            throw new ValidationError("Reset.hpl.virtual.account.internal.virtualAccountId.is.required",
                getPropertyName(form, f => f.virtualAccountId),
                "Field virtualAccountId is required");
        }

        return Promise.resolve();
    }

    async process(form: ResetHplVirtualAccountForm): Promise<EmptyHplResult> {

        const virtualAccountState = await this.hplVirtualAccountStateCacheDataHandler.process({
            virtualAccountId: form.virtualAccountId,
            loadType: LoadType.Cache
        });

        if (!virtualAccountState) {
            throw new ValidationError("virtual.account.state.not.found", "virtualAccountId", "Virtual Account State not found")
        }

        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        await ingressActorWrapper.updateVirtualAccount(
            form.virtualAccountId,
            virtualAccountState.accountId,
            BigInt(0),
            virtualAccountState.time
        );

        await this.hplVirtualAccountStateCacheDataHandler.process({
            virtualAccountId: form.virtualAccountId,
            loadType: LoadType.Full
        });

        return {};
    }


}
