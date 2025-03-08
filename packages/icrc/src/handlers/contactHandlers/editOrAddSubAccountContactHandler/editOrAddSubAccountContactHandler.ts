import { BaseHandler, getPropertyName, ILogger, LoadType, ValidationError } from "@ic-wallet-middleware/common";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AddSubAccountContactForm } from "@icrc/types";
import { ContactResult } from "@icrc/types/contacts/contactResult";
import { Inject, Service } from "typedi";

@Service()
export class EditOrAddSubAccountContactHandler extends BaseHandler<AddSubAccountContactForm, ContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
        private getIcrcAllowanceForContactHandler: GetIcrcAllowanceForContactCacheHandler
    ) {
        super(logger);

    }

    public async validate(form: AddSubAccountContactForm): Promise<void> {

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

        if (!form.subAccountName) {
            throw new ValidationError("edit.contact.subAccountName.is.required",
                getPropertyName(form, (v) => v.subAccountName),
                "Field subAccountName is required");
        }

        return Promise.resolve();
    }

    public async process(form: AddSubAccountContactForm): Promise<ContactResult> {

        const contact = await this.contactRepository.getContactByPrincipal(form.principal);
        let asset = this.contactRepository.getContactAssetOrDefault(contact, form.ledgerAddress);

        if (!asset) {
            const contactModel = await this.contactRepository.addAssetContact({ ledgerAddress: form.ledgerAddress, principal: form.principal });
            asset = this.contactRepository.getContactAsset(contactModel, form.ledgerAddress);
        }

        const subAccount = asset.subAccounts.find((sa) => sa.subAccountId === form.subAccountId.toString());

        if (subAccount) {
            await this.contactRepository.updateSubAccountContact({
                ledgerAddress: form.ledgerAddress,
                principal: form.principal,
                oldSubAccountId: form.subAccountId,
                newSubAccountName: form.subAccountName,
                newSubAccountId: form.subAccountId
            });
        }
        else {
            await this.contactRepository.addSubAccountContact(form);
            await this.getIcrcAllowanceForContactHandler.process({
                senderPrincipal: form.principal,
                ledgerAddress: form.ledgerAddress,
                subAccountId: form.subAccountId,
                loadType: LoadType.Full
            });
        }

        return {};
    }


}
