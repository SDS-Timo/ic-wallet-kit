import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { ContactResult } from "@icrc/types/contacts/contactResult";
import { RemoveContactForm } from "@icrc/types/contacts/removeContactForm";
import { Inject, Service } from "typedi";

@Service()
export class RemoveContactHandler extends BaseHandler<RemoveContactForm, ContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
    ) {
        super(logger);
    }

    public async validate(form: RemoveContactForm): Promise<void> {

        if (!form.principal) {
            throw new ValidationError("removing.contact.principal.is.required",
                getPropertyName(form, (v) => v.principal),
                "Field principal is required");
        }

        const isExists = await this.contactRepository.isContactExist(form.principal);

        if (!isExists) {
            throw new ValidationError("removing.contact.not.exists",
                "",
                "Contact not exists");
        }
    }

    public async process(form: RemoveContactForm): Promise<ContactResult> {
        await this.contactRepository.removeContact(form.principal);
        return {};
    }


}
