import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { EditSubAccountContactHandler, SubAccountId } from "@ic-wallet-kit/icrc";


import Container from "typedi";

export const editSubAccountContact = async (principal: string, ledgerAddress: string,
    newSubAccountIndex: string, newSubAccountName: string, oldSubAccountIndex: string) => {

    const handler = Container.get(EditSubAccountContactHandler);

    const result = await handler.handle({
        principal: principal,
        ledgerAddress: ledgerAddress,
        newSubAccountId: SubAccountId.parseFromString(newSubAccountIndex),
        newSubAccountName: newSubAccountName,
        oldSubAccountId: SubAccountId.parseFromString(oldSubAccountIndex)
    });

    consoleOutputFormJson(result);
}