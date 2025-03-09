
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { RemoveHplContactLinkHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const removeHplContactLink = async (contactId: string, linkId: string) => {

    const removeHplContactLinkHandler = Container.get(RemoveHplContactLinkHandler);

    const result = await removeHplContactLinkHandler.handle({
        principal: Principal.fromText(contactId),
        linkId: linkId
    });

    consoleOutputFormJson(result);

}