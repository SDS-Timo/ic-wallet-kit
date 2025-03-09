import { consoleOutputJson } from "@app/utils/consoleOutput";
import { CheckAssetHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export const checkAsset = async (ledgerAddress: string, indexAddress: string) => {

    const checkAssetHandler = Container.get(CheckAssetHandler)

    const result = await checkAssetHandler.handle({
        ledgerAddress: ledgerAddress,
        indexAddress: indexAddress
    });

    consoleOutputJson(result);
}