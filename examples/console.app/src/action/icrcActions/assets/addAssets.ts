import { consoleOutput, consoleOutputFormJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { AddAssetHandler, GetAvailableAssetsHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";


export const addAssets = async (ledgerAddress: string) => {

    const handler = Container.get(AddAssetHandler)

    let getAvailableAssetsHandler: GetAvailableAssetsHandler = Container.get(GetAvailableAssetsHandler)


    let asset = (await getAvailableAssetsHandler.process({ loadType: LoadType.Cache }))
        .tokenList
        .find((a) => a.ledgerAddress == ledgerAddress);

    if (ledgerAddress == "ryjl3-tyaaa-aaaaa-aaaba-cai") {
        asset =
        {
            indexAddress: "0",
            symbol: "ICP",
            name: "Internet Computer",
            ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
            decimal: 8,
            logo: "",
            supportedStandard: []
        }
    }

    if (!asset) {
        consoleOutput("Asset not found.");
        return;
    }

    const result = await handler.handle({
        ledgerAddress: asset.ledgerAddress,
        indexAddress: asset.indexAddress,
        name: asset.name,
        symbol: asset.symbol,
        shortDecimal: asset.decimal
    });

    consoleOutputFormJson(result);
}
