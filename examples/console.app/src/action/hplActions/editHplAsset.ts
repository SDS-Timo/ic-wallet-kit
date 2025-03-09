import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { EditHplAssetHandler } from "@ic-wallet-kit/hpl";

import Container from "typedi";

export const editHplAsset = async (assetId: string, name: string, symbol: string) => {

    const editHplAssetHandler = Container.get(EditHplAssetHandler);

    const result = await editHplAssetHandler.handle({
        assetId: BigInt(assetId),
        name: name,
        symbol: symbol
    });

    consoleOutputFormJson(result);
}