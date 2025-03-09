
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { SubAccountId, TransferFromServiceHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";


export const transferFromService = async (fromPrincipal: string, toPrincipal: string, assetPrincipal: string, toSubId: string, amount: string) => {

    let transferFromServiceHandler: TransferFromServiceHandler = Container.get(TransferFromServiceHandler);

    let result = await transferFromServiceHandler.handle({
        fromPrincipal: fromPrincipal,
        toPrincipal: toPrincipal,
        ledgerAddress: assetPrincipal,
        toSubId: SubAccountId.parseFromString(toSubId)!,
        amount: amount
    })
    consoleOutputFormJson(result);
}