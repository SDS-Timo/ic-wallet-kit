
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { CheckServicePrincipalHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";


export const checkServicePrincipal = async (servicePrincipal: string) => {

    const handler = Container.get(CheckServicePrincipalHandler)

    const result = await handler.handle({
        servicePrincipal: servicePrincipal,
    });

    consoleOutputFormJson(result);
}