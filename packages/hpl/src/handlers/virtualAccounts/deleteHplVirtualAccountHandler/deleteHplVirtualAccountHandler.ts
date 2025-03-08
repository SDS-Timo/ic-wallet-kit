import { DeleteHplVirtualAccountForm, EmptyHplResult } from "@hpl/forms";
import { DeleteHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class DeleteHplVirtualAccountHandler extends BaseHandler<DeleteHplVirtualAccountForm, EmptyHplResult> {

    private hplVirtualAccountRepository: HplVirtualAccountRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private deleteHplVirtualAccountInternalHandler: DeleteHplVirtualAccountInternalHandler,
        @Inject("HplVirtualAccountRepository")
        hplVirtualAccountRepository: HplVirtualAccountRepository,
    ) {
        super(logger);
        this.hplVirtualAccountRepository = hplVirtualAccountRepository;
    }
    validate(form: DeleteHplVirtualAccountForm): Promise<void> {

        if (form.virtualAccountId === undefined) {
            throw new ValidationError("removing.hpl.virtualAccount.virtualAccountId.is.required",
                getPropertyName(form, f => f.virtualAccountId),
                "Field virtualAccountId is required");
        }

        return Promise.resolve();
    }

    async process(form: DeleteHplVirtualAccountForm): Promise<EmptyHplResult> {
        const result = await this.deleteHplVirtualAccountInternalHandler.process(form);
        await this.hplVirtualAccountRepository.removeVirtualAccount(form.virtualAccountId.toString())
        return result;
    }



}