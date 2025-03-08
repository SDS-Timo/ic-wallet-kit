
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { TransferHandler } from "@ic-wallet-middleware/hpl";
import { AccountTransferModel, VirtualAccountTransferModel } from "@ic-wallet-middleware/hpl/dist/forms/transfers/hplTransferForm";

import Container from "typedi";

export const transferLinkToAccount = async (assetId: string, fromPrincipal: string, fromVirtualAccountId: string, toAccountId: string, amount: string) => {

    const transferHandler = Container.get(TransferHandler);
    const txFrom = new VirtualAccountTransferModel();
    txFrom.id = BigInt(fromVirtualAccountId);
    txFrom.owner = fromPrincipal;
    const txTo = new AccountTransferModel();
    txTo.id = BigInt(toAccountId);

    const result = await transferHandler.handle({
        assetId: BigInt(assetId),
        amount: amount,
        txFrom: txFrom,
        txTo: txTo
    });

    consoleOutputFormJson(result);

}