import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { EditHplContactHandler } from "@ic-wallet-middleware/hpl";

import Container from "typedi";

export const editHplContact = async (contactId: string, name: string, linkId: string, linkName: string) => {

    const editHplContactHandler = Container.get(EditHplContactHandler);

    const result = await editHplContactHandler.handle({
        principal: Principal.fromText(contactId),
        contactName: name,
        linkIds: [{
            linkName: linkName,
            remoteId: linkId
        }]
    });
    consoleOutputFormJson(result);
}