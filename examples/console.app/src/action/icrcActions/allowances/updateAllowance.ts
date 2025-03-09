import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { SubAccountId, UpdateAllowanceHandler } from "@ic-wallet-kit/icrc";


import Container from "typedi";


export const updateAllowance = async (ledgerAddress: string, subAccountId: string, spenderPrincipal: string, amount: string, spenderSubId: string, expiration?: string) => {

    const updateAllowanceHandler = Container.get(UpdateAllowanceHandler);

    const result = await updateAllowanceHandler.handle({
        ledgerAddress: ledgerAddress,
        spenderPrincipal: spenderPrincipal,
        spenderSubId: SubAccountId.parseFromString(spenderSubId)!,
        subAccountId: SubAccountId.parseFromString(subAccountId)!,
        amount: BigInt(amount),
        expiration: expiration
    });

    consoleOutputFormJson(result);

}
