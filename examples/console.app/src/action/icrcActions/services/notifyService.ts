
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { NotifyServiceHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";


export const notifyService = async (servicePrincipal: string, assetPrincipal: string) => {

    const handler = Container.get(NotifyServiceHandler)

    const result = await handler.handle({
        servicePrincipal: servicePrincipal,
        ledgerAddress: assetPrincipal
    });

    consoleOutputFormJson(result);
}