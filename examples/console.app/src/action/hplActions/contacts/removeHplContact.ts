
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { RemoveHplContactHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const removeHplContact = async (contactId: string) => {

    const removeHplContactHandler = Container.get(RemoveHplContactHandler);

    const result = await removeHplContactHandler.handle({
        principal: Principal.fromText(contactId)
    });

    consoleOutputFormJson(result);

}