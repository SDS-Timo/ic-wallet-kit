import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { GetHplAccountListHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const getHplAccountList = async () => {

    const hplAccountCacheDataHandler = Container.get(GetHplAccountListHandler);

    const result = await hplAccountCacheDataHandler.handle({
        loadType: LoadType.Full
    });
    consoleOutputFormJson(result);

}