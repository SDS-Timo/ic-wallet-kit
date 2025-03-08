import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { AssetRepository } from "@icrc/repositories";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AddContactForm } from "@icrc/types/contacts/addContactForm";
import { AssetContactForm } from "@icrc/types/contacts/assetContactForm";
import { ContactModel } from "@icrc/types/contacts/contactModel";
import { ContactResult } from "@icrc/types/contacts/contactResult";
import { SubAccountContactForm } from "@icrc/types/contacts/subAccountContactForm";
import { Inject, Service } from "typedi";

@Service()
export class AddContactHandler extends BaseHandler<AddContactForm, ContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
    ) {
        super(logger);
    }
    public async validate(form: AddContactForm): Promise<void> {

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

        if (isExists) {
            throw new ValidationError("add.contact.already.exists", "", "Contact already exists");
        }

        const subAccounts = form.assets.flatMap((a) => a.subAccounts);

        if (subAccounts.filter((sa) => sa.name.trim().toLowerCase() === "").length > 0) {
            throw new ValidationError("add.contact.subAccount.name.empty",
                "",
                "SubAccount name is empty");
        }

        const assetList = await this.assetRepository.getTokensOrDefault();
        form.assets.forEach((item) => {
            const asset = assetList.find((a) => a.ledgerAddress == item.ledgerAddress)
            if (!asset) {
                throw new ValidationError("add.contact.ledgerAddress.not.found",
                    "",
                    `Asset not found, Ledger address: ${item.ledgerAddress}`
                )
            }
        });
    }

    public async process(form: AddContactForm): Promise<ContactResult> {

        const contact: ContactModel = {
            name: form.name,
            principal: form.principal,
            assets: form.assets.map((a: AssetContactForm) => {
                return {
                    ledgerAddress: a.ledgerAddress,
                    subAccounts: a.subAccounts.map((sa: SubAccountContactForm) => {
                        return {
                            name: sa.name,
                            subAccountId: sa.subAccountId.toString()
                        }
                    })
                }
            })
        };
        await this.contactRepository.addContact(contact);

        return {};
    }

}
