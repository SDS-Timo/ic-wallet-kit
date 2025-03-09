
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { TransferHandler } from "@ic-wallet-kit/hpl";
import { VirtualAccountTransferModel } from "@ic-wallet-kit/hpl/dist/forms/transfers/hplTransferForm";

import Container from "typedi";

export const transferLinkToLink = async (assetId: string, fromPrincipal: string, fromVirtualAccountId: string, toPrincipal: string, toVirtualAccountId: string, amount: string) => {

    const transferHandler = Container.get(TransferHandler);
    const txFrom = new VirtualAccountTransferModel();
    txFrom.id = BigInt(fromVirtualAccountId);
    txFrom.owner = fromPrincipal;
    const txTo = new VirtualAccountTransferModel();
    txTo.id = BigInt(toVirtualAccountId);
    txTo.owner = toPrincipal;

    const result = await transferHandler.handle({
        assetId: BigInt(assetId),
        amount: amount,
        txFrom: txFrom,
        txTo: txTo
    });

    consoleOutputFormJson(result);

}