
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddServiceHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";


export const addService = async (servicePrincipal: string, newName: string) => {

    const handler = Container.get(AddServiceHandler)

    const result = await handler.handle({
        servicePrincipal: servicePrincipal,
        newName: newName
    });

    consoleOutputFormJson(result);
}