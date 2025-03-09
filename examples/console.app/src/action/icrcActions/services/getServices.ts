
import { consoleOutput, consoleOutputFormJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { GetListServiceHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";


export const getServices = async () => {

    const startTime = performance.now();

    const handler = Container.get(GetListServiceHandler)

    const result = await handler.handle({ loadType: LoadType.Cache });

    const endTime = performance.now();

    consoleOutputFormJson(result);

    consoleOutput(`Call to GetListServiceHandler took ${(endTime - startTime) / 1000} seconds`);
}