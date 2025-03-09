
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { EditHplAccountHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const editHplAccount = async (accountId: string, accountName: string,) => {

    const editHplAccountHandler = Container.get(EditHplAccountHandler);

    const result = await editHplAccountHandler.handle({
        accountId: accountId,
        name: accountName
    });

    consoleOutputFormJson(result);

}