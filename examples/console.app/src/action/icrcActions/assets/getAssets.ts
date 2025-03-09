import { consoleOutput, consoleOutputJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { GetListAssetHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

export const getAssets = async () => {

    const startTime = performance.now();

    const getListAssetHandler = Container.get(GetListAssetHandler);

    const result = await getListAssetHandler.handle({
        loadType: LoadType.Cache
    });

    const endTime = performance.now();

    let marketList = result.data?.assets.map((a: any) => {

        return {
            ...a,
            logo: ""
        };
    });

    consoleOutputJson(marketList);

    consoleOutput(`Call to GetListAssetHandler took ${(endTime - startTime) / 1000} seconds`)
}
