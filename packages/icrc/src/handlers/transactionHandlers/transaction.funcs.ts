import { HandlerWrapper } from "@ic-wallet-kit/common";
import { SendTransactionHandler } from "@icrc/handlers";
import { GetListTransactionHandler } from "@icrc/handlers/transactionHandlers/getListTransactionHandler/getListTransactionHandler";
import { GetListTransactionForm, SendTransactionForm } from "@icrc/types";

export const getListTransaction = async (form: GetListTransactionForm) => {
    const result = await HandlerWrapper.callHandler(GetListTransactionHandler, form);
    return result;
}

export const sendTransaction = async (form: SendTransactionForm) => {
    const result = await HandlerWrapper.callHandler(SendTransactionHandler, form);
    return result;
}
