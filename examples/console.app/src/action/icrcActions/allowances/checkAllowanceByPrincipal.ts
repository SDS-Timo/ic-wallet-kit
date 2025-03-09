import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { CheckAllowanceByPrincipalHandler, SubAccountId } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export const checkAllowanceByPrincipal = async (
    ledgerAddress: string,
    ownerPrincipal: string,
    subAccountId: string,
    spenderPrincipal: string,
    spenderSubId: string) => {

    const checkAllowanceByPrincipalHandler = Container.get(CheckAllowanceByPrincipalHandler);

    const result = await checkAllowanceByPrincipalHandler.handle({
        ledgerAddress: ledgerAddress,
        ownerPrincipal: ownerPrincipal,
        subAccountId: SubAccountId.parseFromString(subAccountId),
        spenderPrincipal: spenderPrincipal,
        spenderSubId: SubAccountId.parseFromString(spenderSubId)
    });

    consoleOutputFormJson(result);

}