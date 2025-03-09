import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { CheckAllowanceHandler, SubAccountId } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export const checkAllowance = async (ledgerAddress: string, subAccountId: string, spenderPrincipal: string, spenderSubId: string) => {

    const checkAllowanceHandler = Container.get(CheckAllowanceHandler);

    const result = await checkAllowanceHandler.handle({
        ledgerAddress: ledgerAddress,
        spenderPrincipal: spenderPrincipal,
        subAccountId: SubAccountId.parseFromString(subAccountId),
        spenderSubId: SubAccountId.parseFromString(spenderSubId)
    });

    consoleOutputFormJson(result);

}
