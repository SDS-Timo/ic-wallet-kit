import { GetHplContactAvailableLinkInfo, GetHplContactAvailableLinkResult } from "@hpl/forms";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplAvailableRemote } from "@hpl/types";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class GetHplContactAvailableLinkHandler extends BaseHandler<GetHplContactAvailableLinkInfo, GetHplContactAvailableLinkResult> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private getHplContactRemotesHandler: GetHplContactRemotesHandler,
    ) {
        super(logger);

    }
    validate(form: GetHplContactAvailableLinkInfo): Promise<void> {

        if (!form.principal) {
            throw new ValidationError("get.hpl.contact.available.link.principal.is.required",
                getPropertyName(form, f => f.principal),
                "Field principal is required");
        }

        return Promise.resolve();
    }

    async process(form: GetHplContactAvailableLinkInfo): Promise<GetHplContactAvailableLinkResult> {

        const contactRemotesResult = await this.getHplContactRemotesHandler.handle({
            principal: form.principal,
            loadType: form.loadType
        });

        const availableRemotes = contactRemotesResult.data?.map((r) => {
            return {
                remoteAccountId: r.remoteAccountId,
                assetId: r.assetId,
                assetName: r.assetName,
                assetSymbol: r.assetSymbol,
                assetLogo: r.assetLogo,
                code: r.code,
                amount: r.amount,
                expired: r.expired

            } as HplAvailableRemote
        }) ?? []

        return {
            availableRemotes: availableRemotes
        }
    }



}