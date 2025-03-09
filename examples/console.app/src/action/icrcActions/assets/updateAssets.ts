//import { AddAssetHandler } from "@hpl-wallet-middleware";
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { UpdateAssetHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export const updateAssets = async (address: string, name: string, shortDecimal: number, symbol: string) => {

    const handler = Container.get(UpdateAssetHandler);

    const result = await handler.handle(
        {
            ledgerAddress: address,
            assetName: name,
            shortDecimal: shortDecimal,
            symbol: symbol
        });

    consoleOutputFormJson(result);
}