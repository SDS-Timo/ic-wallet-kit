import { DeleteHplVirtualAccountForm, EmptyHplResult } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { CanisterService } from "@hpl/service";
import { BaseHandler, getPropertyName, IdentifierService, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class DeleteHplVirtualAccountInternalHandler extends BaseHandler<
    DeleteHplVirtualAccountForm,
    EmptyHplResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private canisterService: CanisterService,
    ) {
        super(logger);
    }

    validate(form: DeleteHplVirtualAccountForm): Promise<void> {
        if (form.virtualAccountId === undefined) {
            throw new ValidationError("deleting.hpl.virtual.account.internal.virtualAccountId.is.required",
                getPropertyName(form, f => f.virtualAccountId),
                "Field virtualAccountId is required");
        }

        return Promise.resolve();
    }

    async process(form: DeleteHplVirtualAccountForm): Promise<EmptyHplResult> {

        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        await ingressActorWrapper.deleteVirtualAccounts(
            form.virtualAccountId
        );
        return {};
    }


}
