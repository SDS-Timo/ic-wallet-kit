import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddSubAccountContactHandler, SubAccountId } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export const addSubAccountContact = async (principal: string, ledgerAddress: string, subAccountId: string, subAccountName: string) => {

    const handler = Container.get(AddSubAccountContactHandler);

    const result = await handler.handle({
        principal: principal,
        ledgerAddress: ledgerAddress,
        subAccountId: SubAccountId.parseFromString(subAccountId),
        subAccountName: subAccountName,

    });

    consoleOutputFormJson(result);
}