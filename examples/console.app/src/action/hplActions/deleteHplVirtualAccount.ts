import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { DeleteHplVirtualAccountHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const deleteHplVirtualAccount = async (virtualAccountId: string) => {

    const deleteHplVirtualAccountHandler = Container.get(DeleteHplVirtualAccountHandler);

    const result = await deleteHplVirtualAccountHandler.handle({
        virtualAccountId: BigInt(virtualAccountId)
    });

    consoleOutputFormJson(result);
}