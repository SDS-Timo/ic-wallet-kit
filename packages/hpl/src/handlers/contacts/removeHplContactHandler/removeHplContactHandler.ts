

import { RemoveHplContactForm, RemoveHplContactResult } from "@hpl/forms";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class RemoveHplContactHandler extends BaseHandler<RemoveHplContactForm, RemoveHplContactResult> {
    private hplContactRepository: HplContactRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("HplContactRepository")
        hplContactRepository: HplContactRepository,
    ) {
        super(logger);
        this.hplContactRepository = hplContactRepository;
    }
    validate(form: RemoveHplContactForm): Promise<void> {
        if (!form.principal) {
            throw new ValidationError("removing.hpl.contact.principal.is.required",
                getPropertyName(form, f => f.principal),
                "Field principal is required");
        }

        return Promise.resolve();
    }

    async process(form: RemoveHplContactForm): Promise<RemoveHplContactResult> {
        await this.hplContactRepository.removeContact(form.principal.toString())
        return {}
    }



}