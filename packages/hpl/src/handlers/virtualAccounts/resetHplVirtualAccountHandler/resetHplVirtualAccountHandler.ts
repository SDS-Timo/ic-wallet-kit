import { EmptyHplResult, ResetHplVirtualAccountForm } from "@hpl/forms";
import { ResetHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class ResetHplVirtualAccountHandler extends BaseHandler<ResetHplVirtualAccountForm, EmptyHplResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private resetHplVirtualAccountInternalHandler: ResetHplVirtualAccountInternalHandler
    ) {
        super(logger);
    }
    validate(form: ResetHplVirtualAccountForm): Promise<void> {

        if (form.virtualAccountId === undefined) {
            throw new ValidationError("reset.hpl.virtualAccount.virtualAccountId.is.required",
                getPropertyName(form, f => f.virtualAccountId),
                "Field virtualAccountId is required");
        }

        return Promise.resolve();
    }

    async process(form: ResetHplVirtualAccountForm): Promise<EmptyHplResult> {

        await this.resetHplVirtualAccountInternalHandler.process(form);
        return {};
    }



}