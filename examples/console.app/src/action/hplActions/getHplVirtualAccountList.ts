import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-middleware/common";
import { GetHplVirtualAccountListHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

export const getHplVirtualAccountList = async () => {

    const getHplVirtualAccountListHandler = Container.get(GetHplVirtualAccountListHandler);

    const result = await getHplVirtualAccountListHandler.handle({
        loadType: LoadType.Full
    });

    consoleOutputFormJson(result);

    //   const storage = Container.get("IStorage");

    //   console.log(storage);
}