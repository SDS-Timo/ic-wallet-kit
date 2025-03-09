
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { TransferHandler } from "@ic-wallet-kit/hpl";
import { AccountTransferModel } from "@ic-wallet-kit/hpl/dist/forms/transfers/hplTransferForm";

import Container from "typedi";

export const transferAccountToAccount = async (assetId: string, fromAccountId: string, toAccountId: string, amount: string) => {

    const transferHandler = Container.get(TransferHandler);
    const txFrom = new AccountTransferModel();
    txFrom.id = BigInt(fromAccountId);
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