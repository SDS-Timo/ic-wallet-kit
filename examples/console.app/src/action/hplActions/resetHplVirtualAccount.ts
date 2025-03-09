import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { ResetHplVirtualAccountHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const resetHplVirtualAccount = async (virtualAccountId: string) => {

    const resetHplVirtualAccountHandler = Container.get(ResetHplVirtualAccountHandler);

    const result = await resetHplVirtualAccountHandler.handle({
        virtualAccountId: BigInt(virtualAccountId)
    });

    consoleOutputFormJson(result);
}