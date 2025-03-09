import { consoleOutputJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { GetHplAssetListHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const getHplAssetList = async () => {

    const getHplAssetListHandler = Container.get(GetHplAssetListHandler);

    const result = await getHplAssetListHandler.handle({
        loadType: LoadType.Full
    });

    if (result.isSuccess) {
        let marketList = result.data?.ftAssets.map((a: any) => {

            return {
                ...a,
                logo: ""
            };
        });
        consoleOutputJson(marketList);
    }
    else {
        consoleOutputJson(result);
    }

    //  const storage = Container.get("IStorage");

    //   console.log(storage);

}