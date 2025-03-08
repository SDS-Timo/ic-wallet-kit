import { BaseHandler, getPropertyName, ILogger, LoadType, ValidationError } from "@ic-wallet-middleware/common";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AssetManagerConfiguration } from "@icrc/types/configuration/assetManagerConfiguration";
import { AddSubAccountContactForm } from "@icrc/types/contacts/addSubAccountContactForm";
import { AddSubAccountContactResult } from "@icrc/types/contacts/addSubAccountContactResult";
import { convertBigIntToDateString } from "@icrc/utils/dateTimeUtils";
import { Inject, Service } from "typedi";

@Service()
export class AddSubAccountContactHandler extends BaseHandler<AddSubAccountContactForm, AddSubAccountContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetManagerConfiguration")
        private configuration: AssetManagerConfiguration,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
        private getIcrcAllowanceForContactHandler: GetIcrcAllowanceForContactCacheHandler
    ) {
        super(logger);

    }

    public validate(form: AddSubAccountContactForm): Promise<void> {

        if (!form.principal) {
            throw new ValidationError("add.subAccount.contact.principal.is.required",
                getPropertyName(form, (v) => v.principal),
                "Field principal is required");
        }

        if (!form.ledgerAddress) {
            throw new ValidationError("add.subAccount.contact.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        if (!form.subAccountName) {
            throw new ValidationError("add.subAccount.contact.subAccountName.is.required",
                getPropertyName(form, (v) => v.subAccountName),
                "Field subAccountName is required");
        }

        return Promise.resolve();
    }

    public async process(form: AddSubAccountContactForm): Promise<AddSubAccountContactResult> {
        await this.contactRepository.addSubAccountContact(form);
        const allowance = await this.getIcrcAllowanceForContactHandler.process({
            senderPrincipal: form.principal,
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccountId,
            loadType: LoadType.Full
        });
        return {
            subAccount: {
                name: form.subAccountName,
                subAccountId: form.subAccountId,
                allowance: allowance.amount > BigInt(0)
                    ? {
                        ledgerAddress: allowance.ledgerAddress,
                        subAccount: allowance.subAccountId,
                        sender: allowance.senderPrincipal,
                        amount: allowance.amount,
                        expiration: convertBigIntToDateString(allowance.expiration, this.configuration.defaultDateTimeFormat)
                    }
                    : undefined
            }
        };
    }


}
