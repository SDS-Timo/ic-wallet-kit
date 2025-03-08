import { AddHplVirtualAccountForm } from "@hpl/forms";
import { AddHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { HplVirtualAccount } from "@hpl/types";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class AddHplVirtualAccountHandler extends BaseHandler<AddHplVirtualAccountForm, HplVirtualAccount> {

    private hplVirtualAccountRepository: HplVirtualAccountRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private addHplVirtualAccountInternalHandler: AddHplVirtualAccountInternalHandler,
        @Inject("HplVirtualAccountRepository")
        hplVirtualAccountRepository: HplVirtualAccountRepository,
    ) {
        super(logger);
        this.hplVirtualAccountRepository = hplVirtualAccountRepository;
    }
    validate(form: AddHplVirtualAccountForm): Promise<void> {
        if (form.assetId === undefined) {
            throw new ValidationError("adding.hpl.virtual.account.assetId.is.required",
                getPropertyName(form, f => f.assetId),
                "Field assetId is required");
        }

        if (form.accountId === undefined) {
            throw new ValidationError("adding.hpl.virtual.account.accountId.is.required",
                getPropertyName(form, f => f.accountId),
                "Field accountId is required");
        }

        if (!form.accessByPrincipal) {
            throw new ValidationError("adding.hpl.virtual.account.accessByPrincipal.is.required",
                getPropertyName(form, f => f.accessByPrincipal),
                "Field accessByPrincipal is required");
        }

        if (form.amount === undefined) {
            throw new ValidationError("adding.hpl.virtual.account.amount.is.required",
                getPropertyName(form, f => f.amount),
                "Field amount is required");
        }

        return Promise.resolve();
    }

    async process(form: AddHplVirtualAccountForm): Promise<HplVirtualAccount> {

        const handlerResult = await this.addHplVirtualAccountInternalHandler.handle(form);
        if (!handlerResult.isSuccess) {
            throw handlerResult.errors;
        }

        const result = handlerResult.data!;
        const model = {
            id: result.virtualAccountId.toString(),
            accountId: result.accountId.toString(),
            name: form.virtualAccountName
        }
        await this.hplVirtualAccountRepository.addVirtualAccount(model);
        return result;
    }
}