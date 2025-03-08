import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { RemoveSubAccountContactHandler, SubAccountId } from "@ic-wallet-middleware/icrc";

import Container from "typedi";

export const removeSubAccountContact = async (principal: string, ledgerAddress: string, subAccountIndex: string) => {

    const handler = Container.get(RemoveSubAccountContactHandler);

    const result = await handler.handle({
        principal: principal,
        ledgerAddress: ledgerAddress,
        subAccountId: SubAccountId.parseFromString(subAccountIndex)
    });

    consoleOutputFormJson(result);
}