import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { EditHplVirtualAccountHandler } from "@ic-wallet-middleware/hpl";

import Container from "typedi";

export const editHplVirtualAccount = async (virtualAccountId: string,
    accountId: string,
    virtualAccountName: string,
    amount: string) => {

    const editHplVirtualAccountHandler = Container.get(EditHplVirtualAccountHandler);

    const result = await editHplVirtualAccountHandler.handle({
        virtualAccountId: BigInt(virtualAccountId),
        virtualAccountName: virtualAccountName,
        accountId: BigInt(accountId),
        amount: BigInt(amount)
    });

    consoleOutputFormJson(result);
}