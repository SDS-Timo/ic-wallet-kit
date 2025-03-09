import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddAssetContactHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export const addAssetContact = async (principal: string, ledgerAddress: string) => {

    const handler = Container.get(AddAssetContactHandler);

    const result = await handler.handle({
        principal: principal,
        ledgerAddress: ledgerAddress
    });

    consoleOutputFormJson(result);
}