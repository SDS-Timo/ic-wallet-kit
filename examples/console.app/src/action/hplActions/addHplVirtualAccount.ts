import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { AddHplVirtualAccountHandler } from "@ic-wallet-middleware/hpl";

import Container from "typedi";

export const addHplVirtualAccount = async (assetId: string,
    accountId: string,
    virtualAccountName: string,
    accessByPrincipal: string,
    amount: string): Promise<string> => {

    const addHplVirtualAccountHandler = Container.get(AddHplVirtualAccountHandler);

    const result = await addHplVirtualAccountHandler.handle({
        virtualAccountName: virtualAccountName,
        assetId: BigInt(assetId),
        accountId: BigInt(accountId),
        accessByPrincipal: Principal.fromText(accessByPrincipal),
        amount: BigInt(amount)
    });

    consoleOutputFormJson(result);

    return result.data?.virtualAccountId.toString() ?? "0";
}