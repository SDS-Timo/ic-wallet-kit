
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { RemoveServiceAssetsHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";

export const removeServiceAsset = async (servicePrincipal: string, ledgerAddress: string) => {

    const handler = Container.get(RemoveServiceAssetsHandler)

    const result = await handler.handle({
        servicePrincipal: servicePrincipal,
        ledgerAddress: ledgerAddress
    });

    consoleOutputFormJson(result);
}