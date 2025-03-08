import { AddHplVirtualAccountForm, CheckLinkCodeForm, DeleteHplVirtualAccountForm, EditHplVirtualAccountForm, GetHplVirtualAccountListInfo, ResetHplVirtualAccountForm } from "@hpl/forms";
import { AddHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/addHplVirtualAccountHandler/addHplVirtualAccountHandler";
import { CheckLinkCodeHandler } from "@hpl/handlers/virtualAccounts/checkLinkCodeHandler/checkLinkCodeHandler";
import { DeleteHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/deleteHplVirtualAccountHandler/deleteHplVirtualAccountHandler";
import { EditHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/editHplVirtualAccountHandler/editHplVirtualAccountHandler";
import { GetHplVirtualAccountListHandler } from "@hpl/handlers/virtualAccounts/getHplVirtualAccountListHandler/getHplVirtualAccountListHandler";
import { ResetHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/resetHplVirtualAccountHandler/resetHplVirtualAccountHandler";
import { HandlerWrapper } from "@ic-wallet-middleware/common";

export const addHplVirtualAccount = async (form: AddHplVirtualAccountForm) => {
    const result = await HandlerWrapper.callHandler(AddHplVirtualAccountHandler, form);
    return result;
}

export const deleteHplVirtualAccount = async (form: DeleteHplVirtualAccountForm) => {
    const result = await HandlerWrapper.callHandler(DeleteHplVirtualAccountHandler, form);
    return result;
}

export const editHplVirtualAccount = async (form: EditHplVirtualAccountForm) => {
    const result = await HandlerWrapper.callHandler(EditHplVirtualAccountHandler, form);
    return result;
}

export const checkLinkCode = async (form: CheckLinkCodeForm) => {
    const result = await HandlerWrapper.callHandler(CheckLinkCodeHandler, form);
    return result;
}

export const getHplVirtualAccountList = async (form: GetHplVirtualAccountListInfo) => {
    const result = await HandlerWrapper.callHandler(GetHplVirtualAccountListHandler, form);
    return result;
}

export const resetHplVirtualAccount = async (form: ResetHplVirtualAccountForm) => {
    const result = await HandlerWrapper.callHandler(ResetHplVirtualAccountHandler, form);
    return result;
}