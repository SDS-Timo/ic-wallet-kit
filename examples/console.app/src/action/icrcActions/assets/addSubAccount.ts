import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddSubAccountHandler, SubAccountId } from "@ic-wallet-kit/icrc";


import Container from "typedi";

export const addSubAccount = async (ledgerAddress: string, subAccountId: string, subAccountName: string) => {

    const handler = Container.get(AddSubAccountHandler);

    const result = await handler.handle({ ledgerAddress: ledgerAddress, subAccountId: SubAccountId.parseFromString(subAccountId)!, subAccountName: subAccountName });

    consoleOutputFormJson(result);
}
