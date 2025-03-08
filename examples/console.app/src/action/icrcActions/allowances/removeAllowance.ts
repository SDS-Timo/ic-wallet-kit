import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { RemoveAllowanceHandler, SubAccountId } from "@ic-wallet-middleware/icrc";

import Container from "typedi";

export const removeAllowance = async (ledgerAddress: string, subAccountId: string, spenderPrincipal: string, spenderSubId: string) => {

    const removeAllowanceHandler = Container.get(RemoveAllowanceHandler);

    const result = await removeAllowanceHandler.handle({
        ledgerAddress: ledgerAddress,
        spenderPrincipal: spenderPrincipal,
        spenderSubId: SubAccountId.parseFromString(spenderSubId),
        subAccountId: SubAccountId.parseFromString(subAccountId)
    });

    consoleOutputFormJson(result);

}