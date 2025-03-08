


import { EditHplContactForm, EditHplContactResult } from "@hpl/forms";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { HplContactRemoteDataModel, HplRemote } from "@hpl/types";
import { BaseHandler, getPropertyName, ILogger, LoadType, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class EditHplContactHandler extends BaseHandler<EditHplContactForm, EditHplContactResult> {
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
    validate(form: EditHplContactForm): Promise<void> {

        if (!form.contactName) {
            throw new ValidationError("editing.hpl.contact.name.is.required",
                getPropertyName(form, f => f.contactName),
                "Field contactName is required");
        }

        if (!form.principal) {
            throw new ValidationError("editing.hpl.contact.principal.is.required",
                getPropertyName(form, f => f.principal),
                "Field principal is required");
        }

        return Promise.resolve();
    }

    async process(form: EditHplContactForm): Promise<EditHplContactResult> {
        const contactRemotesResult = await this.getHplContactRemotesHandler.handle({
            principal: form.principal,
            loadType: LoadType.Full
        });
        const contact = await this.hplContactRepository.getContactById(form.principal.toString())
        const remoteDataModels: HplContactRemoteDataModel[] = [];
        const remotes: HplRemote[] = [];
        for (let linkModelId of form.linkIds) {
            let contactRemote = contactRemotesResult?.data
                ?.find((r) => r.remoteAccountId == linkModelId.remoteId);
            if (contactRemote) {
                const remoteData = {
                    name: linkModelId.linkName,
                    remoteId: linkModelId.remoteId,
                }
                remoteDataModels.push(remoteData);
                contactRemote.name = remoteData.name;
                remotes.push(contactRemote);
            }

        }
        contact.name = form.contactName;
        contact.remotes = remoteDataModels;
        await this.hplContactRepository.updateContact(contact);
        return {
            remotes: remotes
        }
    }



}