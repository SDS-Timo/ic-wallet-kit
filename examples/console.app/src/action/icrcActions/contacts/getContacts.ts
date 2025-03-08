import { consoleOutput, consoleOutputFormJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-middleware/common";
import { GetListContactHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";

export const getContacts = async () => {

    const startTime = performance.now();

    const getListContactHandler = Container.get(GetListContactHandler);

    const result = await getListContactHandler.handle({
        loadType: LoadType.Cache
    });


    const endTime = performance.now();

    consoleOutputFormJson(result);

    consoleOutput(`Call to GetListContactHandler took ${(endTime - startTime) / 1000} seconds`);
}