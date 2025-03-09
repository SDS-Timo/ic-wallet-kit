import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { RemoveSubAccountHandler, SubAccountId } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export const removeSubAccount = async (ledgerAddress: string, subAccountId: string) => {


    const handler = Container.get(RemoveSubAccountHandler);

    const result = await handler.handle({ ledgerAddress: ledgerAddress, subAccountId: SubAccountId.parseFromString(subAccountId)! });

    consoleOutputFormJson(result);
}
