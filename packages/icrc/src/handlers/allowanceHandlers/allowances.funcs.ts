import { HandlerWrapper } from "@ic-wallet-kit/common";
import { CheckAllowanceByPrincipalHandler, CheckAllowanceHandler, GetListAllowanceHandler, RemoveAllowanceHandler, TransferFromAllowanceHandler, UpdateAllowanceHandler } from "@icrc/handlers";
import { AddAllowanceHandler } from "@icrc/handlers/allowanceHandlers/addAllowanceHandler/addAllowanceHandler";
import { AddAllowanceForm, CheckAllowanceByPrincipalForm, CheckAllowanceForm, GetListAllowanceForm, RemoveAllowanceForm, TransferFromAllowanceForm, UpdateAllowanceForm } from "@icrc/types/forms";

export const addAllowance = async (form: AddAllowanceForm) => {
    const result = await HandlerWrapper.callHandler(AddAllowanceHandler, form);
    return result;
}

export const checkAllowanceByPrincipal = async (form: CheckAllowanceByPrincipalForm) => {
    const result = await HandlerWrapper.callHandler(CheckAllowanceByPrincipalHandler, form);
    return result;
}

export const checkAllowance = async (form: CheckAllowanceForm) => {
    const result = await HandlerWrapper.callHandler(CheckAllowanceHandler, form);
    return result;
}

export const getListAllowance = async (form: GetListAllowanceForm) => {
    const result = await HandlerWrapper.callHandler(GetListAllowanceHandler, form);
    return result;
}

export const removeAllowance = async (form: RemoveAllowanceForm) => {
    const result = await HandlerWrapper.callHandler(RemoveAllowanceHandler, form);
    return result;
}

export const transferFromAllowance = async (form: TransferFromAllowanceForm) => {
    const result = await HandlerWrapper.callHandler(TransferFromAllowanceHandler, form);
    return result;
}

export const updateAllowanceHandler = async (form: UpdateAllowanceForm) => {
    const result = await HandlerWrapper.callHandler(UpdateAllowanceHandler, form);
    return result;
}
