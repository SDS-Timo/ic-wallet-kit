import { consoleOutput, consoleOutputJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { GetAvailableAssetsHandler, GetTokenMarketHandler } from "@ic-wallet-kit/icrc";


import { Container } from "typedi";

export const getAssetMarkets = async () => {

    let getAvailableAssetsHandler: GetAvailableAssetsHandler = Container.get(GetAvailableAssetsHandler);

    const startTime = performance.now();

    const markets = (await getAvailableAssetsHandler.handle({ loadType: LoadType.Cache })).data?.tokenList;

    const endTime = performance.now();


    let marketList = markets?.map((m: any) => {

        return {
            name: m.name,
            symbol: m.symbol,
            ledgerAddress: m.ledgerAddress
        };
    });

    consoleOutputJson(marketList);

    consoleOutput(`Call to GetAvailableAssetsHandler took ${(endTime - startTime) / 1000} seconds`);

}

export const getTokenMarkets = async () => {
    const startTime = performance.now();
    let getTokenMarketHandler: GetTokenMarketHandler = Container.get(GetTokenMarketHandler)
    const markets = (await getTokenMarketHandler.handle({ loadType: LoadType.Cache })).data;
    const endTime = performance.now();

    consoleOutputJson(markets);

    consoleOutput(`Call to GetTokenMarketHandler took ${(endTime - startTime) / 1000} seconds`);
}
