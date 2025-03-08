import { consoleOutput, consoleOutputFormJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-middleware/common";
import { GetListAllowanceHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";

export const getAllowances = async (ledgerAddress: string) => {

    const startTime = performance.now();

    const getListAllowanceHandler = Container.get(GetListAllowanceHandler);

    const result = await getListAllowanceHandler.handle({
        ledgerAddress: ledgerAddress,
        loadType: LoadType.Cache
    });
    //const storage = Container.get("IStorage");
    //console.log(storage);
    const endTime = performance.now();

    consoleOutputFormJson(result);

    consoleOutput(`Call to GetListAllowanceHandler took ${(endTime - startTime) / 1000} seconds`);

}