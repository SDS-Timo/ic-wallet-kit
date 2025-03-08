/*
import { consoleOutput } from "@app/utils/consoleOutput";
import { jsonStringify } from "@app/utils/json.utils";

import { LoadHplAssetHandler } from "@hpl-wallet-middleware/hpl/internalHandlers/load.hpl.asset.handler";
import Container from "typedi";

export const getHpl = async () => {

    const loadHplAssetHandler = Container.get(LoadHplAssetHandler);

    const result = await loadHplAssetHandler.handle({
        contacts: [],
        ingressCanisterId: "rqx66-eyaaa-aaaap-aaona-cai",
        ownerCanisterId:"n65ik-oqaaa-aaaag-acb4q-cai",
        dictionaryCanisterId: "lpwlq-2iaaa-aaaap-ab2vq-cai",
        loadType: LoadType.Full
    });


    consoleOutputFormJson(result);

}
    */