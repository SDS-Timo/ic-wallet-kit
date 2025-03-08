import { BaseHandler, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { AssetRepository } from "@icrc/repositories";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AddAssetContactForm } from "@icrc/types/contacts/addAssetContactForm";
import { ContactResult } from "@icrc/types/contacts/contactResult";
import { Inject, Service } from "typedi";

@Service()
export class AddAssetContactHandler extends BaseHandler<AddAssetContactForm, ContactResult> {

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

    public async validate(form: AddAssetContactForm): Promise<void> {

        if (!form.principal) {
            throw new ValidationError("add.asset.contact.principal.is.required",
                "principal",
                "Field principal is required");
        }

        if (!form.ledgerAddress) {
            throw new ValidationError("add.asset.contact.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        const asset = await this.assetRepository.getAssetOrDefault(form.ledgerAddress);
        if (!asset) {
            throw new ValidationError("add.asset.contact.ledgerAddress.not.found",
                "ledgerAddress",
                "Asset Not Found"
            )
        }
    }

    public async process(form: AddAssetContactForm): Promise<ContactResult> {

        await this.contactRepository.addAssetContact(form);
        return {};
    }

}
