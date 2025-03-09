import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddAllowanceHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

export const addAllowance = async (ledgerAddress: string,
    subAccountId: string,
    spenderPrincipal: string,
    amount: string,
    spenderSubId: string,
    expiration?: string) => {

    const addAllowanceHandler = Container.get(AddAllowanceHandler);

    const request = {
        ledgerAddress: ledgerAddress,
        spenderPrincipal: spenderPrincipal,
        spenderSubId: SubAccountId.parseFromString(spenderSubId)!,
        subAccountId: SubAccountId.parseFromString(subAccountId)!,
        amount: BigInt(amount),
        expiration: expiration
    };

    //consoleOutputJson(request);

    const result = await addAllowanceHandler.handle(request);

    consoleOutputFormJson(result);

}
