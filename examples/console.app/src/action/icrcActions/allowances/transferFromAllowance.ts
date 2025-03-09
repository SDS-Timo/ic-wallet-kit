import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { SubAccountId, TransferFromAllowanceHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";


export const transferFromAllowance = async (
    ledgerAddress: string,
    fromSubAccountId: string,
    senderPrincipal: string,
    receiverPrincipal: string,
    toSubAccountId: string,
    transferAmount: string) => {

    const transferFromAllowanceHandler = Container.get(TransferFromAllowanceHandler);

    const result = await transferFromAllowanceHandler.handle({
        ledgerAddress: ledgerAddress,
        senderPrincipal: Principal.fromText(senderPrincipal),
        fromSubAccountId: SubAccountId.parseFromString(fromSubAccountId)!,
        toSubAccountId: SubAccountId.parseFromString(toSubAccountId)!,
        receiverPrincipal: Principal.fromText(receiverPrincipal),
        amount: transferAmount
    });

    consoleOutputFormJson(result);

}
