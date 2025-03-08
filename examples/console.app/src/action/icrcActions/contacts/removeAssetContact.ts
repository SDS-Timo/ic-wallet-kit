import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { RemoveAssetContactHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";

export const removeAssetContact = async (principal: string, ledgerAddress: string) => {

    const handler = Container.get(RemoveAssetContactHandler);

    const result = await handler.handle({
        principal: principal,
        ledgerAddress: ledgerAddress
    });

    consoleOutputFormJson(result);
}