
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { AddHplContactHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const addHplContact = async (contactId: string, contactName: string, linkId: string, linkName: string) => {

    const addHplContactHandler = Container.get(AddHplContactHandler);

    const linkIds = []
    linkIds.push({
        linkName: linkName,
        remoteId: linkId
    })
    const result = await addHplContactHandler.handle({
        principal: Principal.fromText(contactId),
        contactName: contactName,
        linkIds: linkIds
    });

    consoleOutputFormJson(result);

}