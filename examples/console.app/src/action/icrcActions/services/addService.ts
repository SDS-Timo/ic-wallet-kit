
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddServiceHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";


export const addService = async (servicePrincipal: string, newName: string) => {

    const handler = Container.get(AddServiceHandler)

    const result = await handler.handle({
        servicePrincipal: servicePrincipal,
        newName: newName
    });

    consoleOutputFormJson(result);
}