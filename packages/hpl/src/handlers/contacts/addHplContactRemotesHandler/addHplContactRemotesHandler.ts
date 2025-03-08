
import { AddHplContactLinkForm, AddHplContactLinkResult } from "@hpl/forms";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { HplRemote } from "@hpl/types";
import { HplContactRemoteDataModel } from "@hpl/types/contacts/hplContactRemoteDataModel";
import { BaseHandler, getPropertyName, ILogger, LoadType, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class AddHplContactRemotesHandler extends BaseHandler<AddHplContactLinkForm, AddHplContactLinkResult> {
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
    public validate(form: AddHplContactLinkForm): Promise<void> {

        if (!form.contactPrincipal) {
            throw new ValidationError("adding.hpl.contact.remotes.principal.is.required",
                getPropertyName(form, f => f.contactPrincipal),
                "Field contactPrincipal is required");
        }

        return Promise.resolve();

    }

    async process(form: AddHplContactLinkForm): Promise<AddHplContactLinkResult> {

        const remoteModels: HplContactRemoteDataModel[] = []

        const contactRemotesResult = await this.getHplContactRemotesHandler.handle({
            principal: form.contactPrincipal,
            loadType: LoadType.Full
        });

        const remotes: HplRemote[] = [];

        for (let linkModelId of form.linkIds) {
            let contactRemote = contactRemotesResult?.data
                ?.find((r) => r.remoteAccountId == linkModelId.remoteId);
            if (contactRemote) {
                const remoteData: HplContactRemoteDataModel = {
                    name: linkModelId.linkName,
                    remoteId: linkModelId.remoteId,
                }
                remoteModels.push(remoteData);
                contactRemote.name = remoteData.name;
                remotes.push(contactRemote);
            }
        }

        await this.hplContactRepository.addContactRemotes(form.contactPrincipal.toString(), remoteModels);

        return {
            links: remotes
        }
    }



}