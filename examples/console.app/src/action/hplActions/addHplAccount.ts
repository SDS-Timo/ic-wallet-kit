
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddHplAccountHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const addHplAccount = async (assetId: string, accountName: string,) => {

    const addHplAccountHandler = Container.get(AddHplAccountHandler);

    const result = await addHplAccountHandler.handle({
        assetId: BigInt(assetId),
        accountName: accountName
    });

    consoleOutputFormJson(result);

}