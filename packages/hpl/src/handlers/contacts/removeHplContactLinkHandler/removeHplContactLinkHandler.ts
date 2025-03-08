

import { RemoveHplContactLinkForm, RemoveHplContactLinkResult } from "@hpl/forms";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class RemoveHplContactLinkHandler extends BaseHandler<RemoveHplContactLinkForm, RemoveHplContactLinkResult> {
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
    validate(form: RemoveHplContactLinkForm): Promise<void> {

        if (!form.principal) {
            throw new ValidationError("removing.hpl.contact.link.principal.is.required",
                getPropertyName(form, f => f.principal),
                "Field principal is required");
        }
        if (!form.linkId) {
            throw new ValidationError("removing.hpl.contact.link.linkId.is.required",
                getPropertyName(form, f => f.linkId),
                "Field linkId is required");
        }

        return Promise.resolve();
    }

    async process(form: RemoveHplContactLinkForm): Promise<RemoveHplContactLinkResult> {
        await this.hplContactRepository.removeContactLink(form.principal.toString(), form.linkId)
        return {}
    }



}