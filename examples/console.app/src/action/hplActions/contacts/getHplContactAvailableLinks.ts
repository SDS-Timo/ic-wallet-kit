import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { LoadType } from "@ic-wallet-kit/common";
import { GetHplContactAvailableLinkHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const getHplContactAvailableLinks = async (contactPrincipal: string) => {

    const getHplContactAvailableLinkHandler = Container.get(GetHplContactAvailableLinkHandler);

    const result = await getHplContactAvailableLinkHandler.handle({
        principal: Principal.fromText(contactPrincipal),
        loadType: LoadType.Full
    });

    consoleOutputFormJson(result);
}