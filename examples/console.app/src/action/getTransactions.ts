import { consoleOutput, consoleOutputFormJson } from "@app/utils/consoleOutput";
import { GetListTransactionHandler, SubAccountId } from "@ic-wallet-middleware/icrc";


import Container from "typedi";

export const getTransactions = async (ledgerAddress: string, subAccountId?: string) => {

    const startTime = performance.now();

    const getListTransactionHandler = Container.get(GetListTransactionHandler);
    const result = await getListTransactionHandler.handle({
        ledgerAddress: ledgerAddress,
        subAccountId: subAccountId ? SubAccountId.parseFromString(subAccountId) : undefined,
        pageInfo: {
            take: 10
        }
    });

    const endTime = performance.now();

    consoleOutputFormJson(result);

    consoleOutput(`Call to GetListAssetHandler took ${(endTime - startTime) / 1000} seconds`);
}
