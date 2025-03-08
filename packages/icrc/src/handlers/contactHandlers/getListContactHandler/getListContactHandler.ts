import { BaseHandler, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AssetContactView, SubAccountId } from "@icrc/types";
import { AssetManagerConfiguration } from "@icrc/types/configuration/assetManagerConfiguration";
import { GetListContactForm } from "@icrc/types/contacts/getListContactForm";
import { GetListContactResult } from "@icrc/types/contacts/getListContactResult";
import { convertBigIntToDateString } from "@icrc/utils/dateTimeUtils";
import { Inject, Service } from "typedi";

@Service()
export class GetListContactHandler extends BaseHandler<GetListContactForm, GetListContactResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetManagerConfiguration")
        private configuration: AssetManagerConfiguration,
        @Inject("ContactRepository")
        private contactRepository: ContactRepository,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
        private getIcrcAllowanceForContactHandler: GetIcrcAllowanceForContactCacheHandler
    ) {
        super(logger);

    }

    public validate(form: GetListContactForm): Promise<void> {
        return Promise.resolve();
    }

    public async process(form: GetListContactForm): Promise<GetListContactResult> {

        const contactList = (await this.contactRepository.getContacts()).map((c) => {
            const contact = {
                principal: c.principal,
                name: c.name,
                hasAllowance: false,
                assets: c.assets.map((a) => {
                    return {
                        ledgerAddress: a.ledgerAddress,
                        subAccounts: a.subAccounts.map((sa) => {
                            return {
                                name: sa.name,
                                subAccountId: SubAccountId.parseFromString(sa.subAccountId),
                            }
                        })
                    }
                }) as AssetContactView[]
            }

            return contact;
        });
        const assetList = await this.assetRepository.getTokensOrDefault();
        for (const contact of contactList) {
            for (const assetContact of contact.assets) {
                const asset = assetList.find((a) => a.ledgerAddress === assetContact.ledgerAddress)
                if (!asset) {
                    throw new ValidationError("asset.contact.not.found", "", "Asset Not Found")
                }
                for (const subAccount of assetContact.subAccounts) {
                    const allowance = await this.getIcrcAllowanceForContactHandler.process({
                        senderPrincipal: contact.principal,
                        ledgerAddress: assetContact.ledgerAddress,
                        subAccountId: subAccount.subAccountId,
                        loadType: form.loadType
                    });
                    subAccount.allowance = allowance.amount > BigInt(0)
                        ? {
                            ledgerAddress: allowance.ledgerAddress,
                            subAccount: allowance.subAccountId,
                            sender: allowance.senderPrincipal,
                            amount: allowance.amount,
                            expiration: convertBigIntToDateString(allowance.expiration, this.configuration.defaultDateTimeFormat)
                        }
                        : undefined
                }
                assetContact.symbol = asset.symbol;
            }
            contact.hasAllowance = contact.assets
                .some((asset) => asset.subAccounts
                    .some((subAccount) => subAccount.allowance))
        }

        return {
            contacts: contactList
        };
    }


}
