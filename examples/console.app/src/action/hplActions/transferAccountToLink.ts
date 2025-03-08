
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { TransferHandler } from "@ic-wallet-middleware/hpl";
import { AccountTransferModel, VirtualAccountTransferModel } from "@ic-wallet-middleware/hpl/dist/forms/transfers/hplTransferForm";

import Container from "typedi";

export const transferAccountToLink = async (assetId: string, fromAccountId: string, toPrincipal: string, toAccountId: string, amount: string) => {

    const transferHandler = Container.get(TransferHandler);
    const txFrom = new AccountTransferModel();
    txFrom.id = BigInt(fromAccountId);
    const txTo = new VirtualAccountTransferModel();
    txTo.id = BigInt(toAccountId);
    txTo.owner = toPrincipal;

    const result = await transferHandler.handle({
        assetId: BigInt(assetId),
        amount: amount,
        txFrom: txFrom,
        txTo: txTo
    });

    consoleOutputFormJson(result);

}