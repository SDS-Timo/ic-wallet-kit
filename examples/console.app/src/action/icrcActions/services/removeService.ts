
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { RemoveServiceHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";


export const removeService = async (servicePrincipal: string) => {

    const handler = Container.get(RemoveServiceHandler)

    const result = await handler.handle({
        servicePrincipal: servicePrincipal
    });

    consoleOutputFormJson(result);
}