import { EditHplAccountForm } from "@hpl/forms/accounts/editHplAccountForm";
import { EditHplAccountResult } from "@hpl/forms/accounts/editHplAccountResult";
import { EditHplAssetResult } from "@hpl/forms/editHplAssetResult";
import { HplAccountRepository } from "@hpl/repositories/persists/hplAccountRepository/hplAccountRepository";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class EditHplAccountHandler extends BaseHandler<EditHplAccountForm, EditHplAccountResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("HplAccountRepository")
        private hplAccountRepository: HplAccountRepository,
    ) {
        super(logger);
    }

    validate(form: EditHplAccountForm): Promise<void> {

        if (form.accountId === undefined) {
            throw new ValidationError("editing.hpl.account.accountId.is.required",
                getPropertyName(form, f => f.accountId),
                "Field accountId is required");
        }

        return Promise.resolve();
    }

    async process(form: EditHplAccountForm): Promise<EditHplAssetResult> {
        await this.hplAccountRepository.updateAccount(form);
        return {}
    }



}