import { AddHplAccountForm, EditHplAccountForm, GetHplAccountListInfo } from "@hpl/forms";
import { AddHplAccountHandler } from "@hpl/handlers/accounts/addHplAccountHandler/addHplAccountHandler";
import { EditHplAccountHandler } from "@hpl/handlers/accounts/editHplAccountHandler/editHplAccountHandler";
import { GetHplAccountListHandler } from "@hpl/handlers/accounts/getHplAccountListHandler/getHplAccountListHandler";
import { HandlerWrapper } from "@ic-wallet-kit/common";


export const getHplAccountList = async (form: GetHplAccountListInfo) => {
    const result = await HandlerWrapper.callHandler(GetHplAccountListHandler, form);
    return result;
}

export const addHplAccount = async (form: AddHplAccountForm) => {
    const result = await HandlerWrapper.callHandler(AddHplAccountHandler, form);
    return result;
}

export const editHplAccount = async (form: EditHplAccountForm) => {
    const result = await HandlerWrapper.callHandler(EditHplAccountHandler, form);
    return result;
}