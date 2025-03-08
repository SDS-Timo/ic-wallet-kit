
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { SubAccountId, TransferToServiceHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";


export const transferToService = async (fromPrincipal: string, fromSubId: string, toPrincipal: string, toSubId: string, amount: string) => {

    let transferToServiceHandler: TransferToServiceHandler = Container.get(TransferToServiceHandler)
    const principal = Principal.fromText(toSubId);

    let result = await transferToServiceHandler.handle({
        fromPrincipal: fromPrincipal,
        fromSubId: SubAccountId.parseFromString(fromSubId),
        toPrincipal: toPrincipal,
        toSubId: SubAccountId.parseFromString(principal.toText()),
        amount: amount
    })

    consoleOutputFormJson(result);
}