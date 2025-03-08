

import { Principal } from "@dfinity/principal";
import { GetHplContactListInfo, GetHplContactListResult } from "@hpl/forms";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { HplContact } from "@hpl/types";
import { BaseHandler, ILogger } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class GetHplContactListHandler extends BaseHandler<GetHplContactListInfo, GetHplContactListResult> {
    private hplContactRepository: HplContactRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private getHplContactRemotesHandler: GetHplContactRemotesHandler,
        @Inject("HplContactRepository")
        hplContactRepository: HplContactRepository,
    ) {
        super(logger);
        this.hplContactRepository = hplContactRepository;
    }
    async validate(form: GetHplContactListInfo): Promise<void> {
    }

    async process(form: GetHplContactListInfo): Promise<GetHplContactListResult> {
        const contacts: HplContact[] = [];

        const contactsData = await this.hplContactRepository.getContacts();

        for (let contactData of contactsData) {
            const contactRemotesResult = await this.getHplContactRemotesHandler.handle({
                principal: Principal.fromText(contactData.principal),
                loadType: form.loadType
            });
            const contact: HplContact = {
                name: contactData.name,
                principal: Principal.fromText(contactData.principal),
                remotes: [],
                availableRemotes: contactRemotesResult.data?.map((r) => {
                    return {
                        remoteAccountId: r.remoteAccountId,
                        assetId: r.assetId,
                        assetName: r.assetName,
                        assetSymbol: r.assetSymbol,
                        assetLogo: r.assetLogo,
                        code: r.code,
                        amount: r.amount,
                        expired: r.expired
                    }
                }) ?? []
            }

            for (let remoteData of contactData.remotes) {
                let contactRemote = contactRemotesResult?.data
                    ?.find((r) => r.remoteAccountId == remoteData.remoteId);
                if (contactRemote) {
                    contactRemote.name = remoteData.name;
                }
                else {
                    contactRemote = {
                        remoteAccountId: remoteData.remoteId,
                        name: remoteData.name,
                        amount: "",
                        code: "",
                        expired: 0,
                        assetId: "",
                        assetName: "",
                        assetSymbol: "",
                        assetLogo: ""
                    }
                }
                contact.remotes.push(contactRemote);
            }
            contacts.push(contact);
        }
        return {
            contacts
        }
    }



}