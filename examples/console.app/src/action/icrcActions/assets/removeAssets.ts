import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { RemoveAssetHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";

export const removeAssets = async (ledgerAddress: string) => {

    const handler = Container.get(RemoveAssetHandler);

    const result = await handler.handle({ ledgerAddress: ledgerAddress });

    consoleOutputFormJson(result);
}