import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { ContactResult } from "@icrc/types/contacts/contactResult";
import { EditSubAccountContactForm } from "@icrc/types/contacts/editSubAccountContactForm";
import { Inject, Service } from "typedi";

@Service()
export class EditSubAccountContactHandler extends BaseHandler<EditSubAccountContactForm, ContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
    ) {
        super(logger);
    }

    public async validate(form: EditSubAccountContactForm): Promise<void> {

        if (!form.principal) {
            throw new ValidationError("edit.contact.principal.is.required",
                getPropertyName(form, (v) => v.principal),
                "Field principal is required");
        }

        if (!form.ledgerAddress) {
            throw new ValidationError("edit.contact.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        if (!form.newSubAccountName) {
            throw new ValidationError("edit.contact.newSubAccountName.is.required",
                getPropertyName(form, (v) => v.newSubAccountName),
                "Field newSubAccountName is required");
        }

        return Promise.resolve();
    }

    public async process(form: EditSubAccountContactForm): Promise<ContactResult> {
        await this.contactRepository.updateSubAccountContact(form);
        return {};
    }
}
