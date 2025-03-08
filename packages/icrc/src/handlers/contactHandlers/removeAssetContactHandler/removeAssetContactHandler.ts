import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { ContactResult } from "@icrc/types/contacts/contactResult";
import { RemoveAssetContactForm } from "@icrc/types/contacts/removeAssetContactForm";
import { Inject, Service } from "typedi";

@Service()
export class RemoveAssetContactHandler extends BaseHandler<RemoveAssetContactForm, ContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
    ) {
        super(logger);
    }

    public async validate(form: RemoveAssetContactForm): Promise<void> {
        if (!form.principal) {
            throw new ValidationError("remove.asset.contact.principal.is.required",
                getPropertyName(form, (v) => v.principal),
                "Field principal is required");
        }

        if (!form.ledgerAddress) {
            throw new ValidationError("remove.asset.contact.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        return Promise.resolve();
    }

    public async process(form: RemoveAssetContactForm): Promise<ContactResult> {
        await this.contactRepository.removeAssetContact(form);
        return {};
    }
}
