import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { ContactResult } from "@icrc/types/contacts/contactResult";
import { EditContactForm } from "@icrc/types/contacts/editContactForm";
import { Inject, Service } from "typedi";

@Service()
export class EditContactHandler extends BaseHandler<EditContactForm, ContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
    ) {
        super(logger);
    }

    public async validate(form: EditContactForm): Promise<void> {

        if (!form.name) {
            throw new ValidationError("add.contact.name.is.required",
                getPropertyName(form, (v) => v.name),
                "Field name is required");
        }
        if (!form.principal) {
            throw new ValidationError("add.contact.principal.is.required",
                getPropertyName(form, (v) => v.principal),
                "Field principal is required");
        }

        const isExists = await this.contactRepository.isContactExist(form.principal);

        if (!isExists) {
            throw new ValidationError("add.contact.not.exists",
                "",
                "Contact not exists");
        }
    }

    public async process(form: EditContactForm): Promise<ContactResult> {
        await this.contactRepository.updateContactName(form.principal, form.name)
        return {};
    }

}
