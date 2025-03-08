import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { ContactResult } from "@icrc/types/contacts/contactResult";
import { RemoveSubAccountContactForm } from "@icrc/types/contacts/removeSubAccountContactForm";
import { Inject, Service } from "typedi";

@Service()
export class RemoveSubAccountContactHandler extends BaseHandler<RemoveSubAccountContactForm, ContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
    ) {
        super(logger);
    }

    public validate(form: RemoveSubAccountContactForm): Promise<void> {
        if (!form.principal) {
            throw new ValidationError("remove.subaccount.contact.principal.is.required",
                getPropertyName(form, (v) => v.principal),
                "Field principal is required");
        }
        if (!form.ledgerAddress) {
            throw new ValidationError("remove.subaccount.contact.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        return Promise.resolve();
    }

    public async process(form: RemoveSubAccountContactForm): Promise<ContactResult> {
        await this.contactRepository.removeSubAccountContact(form);
        return {};
    }
}
