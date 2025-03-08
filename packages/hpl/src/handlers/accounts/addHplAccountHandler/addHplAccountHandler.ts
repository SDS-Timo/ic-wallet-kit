import { AddHplAccountForm } from "@hpl/forms/accounts/addHplAccountForm";
import { AddHplAccountResult } from "@hpl/forms/accounts/addHplAccountResult";
import { AddHplAccountInternalHandler } from "@hpl/internalHandlers";
import { HplAccountRepository } from "@hpl/repositories";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";

import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class AddHplAccountHandler extends BaseHandler<AddHplAccountForm, AddHplAccountResult> {

    private hplAccountRepository: HplAccountRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private addHplAccountInternalHandler: AddHplAccountInternalHandler,
        @Inject("HplAccountRepository")
        hplAccountRepository: HplAccountRepository,
    ) {
        super(logger);
        this.hplAccountRepository = hplAccountRepository
    }
    validate(form: AddHplAccountForm): Promise<void> {

        if (form.assetId === undefined) {
            throw new ValidationError("adding.hpl.account.assetId.is.required",
                getPropertyName(form, f => f.assetId),
                "Field assetId is required");
        }

        return Promise.resolve();
    }

    async process(form: AddHplAccountForm): Promise<AddHplAccountResult> {

        const result = await this.addHplAccountInternalHandler.process(form);
        await this.hplAccountRepository.addAccount({
            id: result.accountId.toString(),
            ftId: form.assetId.toString(),
            name: form.accountName
        });
        result.name = form.accountName;
        return {
            account: result
        }
    }



}