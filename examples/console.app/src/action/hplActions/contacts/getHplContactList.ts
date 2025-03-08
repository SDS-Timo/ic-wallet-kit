import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-middleware/common";
import { GetHplContactListHandler } from "@ic-wallet-middleware/hpl";

import Container from "typedi";

export const getHplContactList = async () => {

    const getHplContactListHandler = Container.get(GetHplContactListHandler);

    const result = await getHplContactListHandler.handle({
        loadType: LoadType.Full
    });

    consoleOutputFormJson(result);
}