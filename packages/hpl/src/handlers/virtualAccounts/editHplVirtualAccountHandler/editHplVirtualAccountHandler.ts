import { EditHplVirtualAccountForm } from "@hpl/forms";
import { EditHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { HplVirtualAccount } from "@hpl/types";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class EditHplVirtualAccountHandler extends BaseHandler<EditHplVirtualAccountForm, HplVirtualAccount> {

    private hplVirtualAccountRepository: HplVirtualAccountRepository

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private editHplVirtualAccountInternalHandler: EditHplVirtualAccountInternalHandler,
        @Inject("HplVirtualAccountRepository")
        hplVirtualAccountRepository: HplVirtualAccountRepository

    ) {
        super(logger);
        this.hplVirtualAccountRepository = hplVirtualAccountRepository;
    }
    validate(form: EditHplVirtualAccountForm): Promise<void> {

        if (form.virtualAccountId === undefined) {
            throw new ValidationError("editing.hpl.virtual.account.virtualAccountId.is.required",
                getPropertyName(form, f => f.virtualAccountId),
                "Field virtualAccountId is required");
        }

        if (form.accountId === undefined) {
            throw new ValidationError("editing.hpl.virtual.account.accountId.is.required",
                getPropertyName(form, f => f.accountId),
                "Field accountId is required");
        }

        if (form.amount === undefined) {
            throw new ValidationError("editing.hpl.virtual.account.amount.is.required",
                getPropertyName(form, f => f.amount),
                "Field amount is required");
        }

        return Promise.resolve();
    }

    async process(form: EditHplVirtualAccountForm): Promise<HplVirtualAccount> {

        const virtualAccounts = await this.hplVirtualAccountRepository.getVirtualAccounts();
        let virtualAccount = virtualAccounts.find((va) => va.id === form.virtualAccountId.toString())
        if (!virtualAccount) {
            throw new ValidationError("virtual.account.not.found", "virtualAccountId", "Virtual Account not found")
        }

        const result = await this.editHplVirtualAccountInternalHandler.process(form);

        virtualAccount.name = form.virtualAccountName;
        virtualAccount.accountId = form.accountId.toString();
        await this.hplVirtualAccountRepository.updateVirtualAccount(virtualAccount);

        return result;
    }



}