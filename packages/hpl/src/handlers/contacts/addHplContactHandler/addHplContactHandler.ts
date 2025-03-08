import { AddHplContactForm, AddHplContactResult } from "@hpl/forms";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { HplAvailableRemote, HplContactDataModel, HplRemote } from "@hpl/types";
import { HplContactRemoteDataModel } from "@hpl/types/contacts/hplContactRemoteDataModel";
import { BaseHandler, getPropertyName, ILogger, LoadType, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class AddHplContactHandler extends BaseHandler<AddHplContactForm, AddHplContactResult> {
    private hplContactRepository: HplContactRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("HplContactRepository")
        hplContactRepository: HplContactRepository,
        private getHplContactRemotesHandler: GetHplContactRemotesHandler,
    ) {
        super(logger);
        this.hplContactRepository = hplContactRepository;
    }
    public validate(form: AddHplContactForm): Promise<void> {
        if (!form.contactName) {
            throw new ValidationError("adding.hpl.contact.contactName.is.required",
                getPropertyName(form, f => f.contactName),
                "Field contactName is required");
        }

        if (!form.principal) {
            throw new ValidationError("adding.hpl.contact.principal.is.required",
                getPropertyName(form, f => f.principal),
                "Field principal is required");
        }

        return Promise.resolve();
    }

    async process(form: AddHplContactForm): Promise<AddHplContactResult> {
        const contact: HplContactDataModel = {
            principal: form.principal.toString(),
            name: form.contactName,
            remotes: []
        }

        const contactRemotesResult = await this.getHplContactRemotesHandler.handle({
            principal: form.principal,
            loadType: LoadType.Full
        });
        const remotes: HplRemote[] = [];
        let availableRemotes: HplAvailableRemote[] = [];
        if (contactRemotesResult.isSuccess) {
            availableRemotes = contactRemotesResult.data?.map((r) => {
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
            }) || []
            for (let linkModelId of form.linkIds) {
                let contactRemote = contactRemotesResult.data?.find((r) => r.remoteAccountId == linkModelId.remoteId);
                if (contactRemote) {
                    const remoteData: HplContactRemoteDataModel = {
                        name: linkModelId.linkName,
                        remoteId: linkModelId.remoteId,
                    }
                    contact.remotes.push(remoteData);
                    contactRemote.name = remoteData.name;
                    remotes.push(contactRemote);
                }
            }
        }
        await this.hplContactRepository.addContact(contact)
        return {
            contact: {
                name: form.contactName,
                principal: form.principal,
                remotes: remotes,
                availableRemotes: availableRemotes
            }
        }
    }



}