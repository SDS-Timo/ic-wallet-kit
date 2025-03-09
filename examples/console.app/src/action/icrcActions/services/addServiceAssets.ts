
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddServiceAssetsHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";


export const addServiceAssets = async (servicePrincipal: string, ledgerAddress: string) => {

    const handler = Container.get(AddServiceAssetsHandler)

    const result = await handler.handle({
        servicePrincipal: servicePrincipal,
        ledgerAddresses: [ledgerAddress]
    });

    consoleOutputFormJson(result);
}