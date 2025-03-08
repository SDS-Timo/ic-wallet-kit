import { HandlerWrapper } from "@ic-wallet-middleware/common";
import { AddServiceAssetsHandler, AddServiceHandler, CheckServicePrincipalHandler, EditServiceNameHandler, GetListServiceHandler, NotifyServiceHandler, RemoveServiceAssetsHandler, RemoveServiceHandler, TransferFromServiceHandler, TransferToServiceHandler } from "@icrc/handlers";
import { AddServiceAssetListForm, AddServiceForm, CheckServicePrincipalForm, EditServiceNameForm, GetServiceListForm, NotifyForm, RemoveServiceAssetForm, RemoveServiceForm, TransferForm, TransferFromServiceForm } from "@icrc/types/forms";

export const addServiceAssets = async (form: AddServiceAssetListForm) => {
    const result = await HandlerWrapper.callHandler(AddServiceAssetsHandler, form);
    return result;
}

export const addService = async (form: AddServiceForm) => {
    const result = await HandlerWrapper.callHandler(AddServiceHandler, form);
    return result;
}

export const checkServicePrincipal = async (form: CheckServicePrincipalForm) => {
    const result = await HandlerWrapper.callHandler(CheckServicePrincipalHandler, form);
    return result;
}

export const editServiceName = async (form: EditServiceNameForm) => {
    const result = await HandlerWrapper.callHandler(EditServiceNameHandler, form);
    return result;
}

export const getListService = async (form: GetServiceListForm) => {
    const result = await HandlerWrapper.callHandler(GetListServiceHandler, form);
    return result;
}

export const notifyService = async (form: NotifyForm) => {
    const result = await HandlerWrapper.callHandler(NotifyServiceHandler, form);
    return result;
}

export const removeServiceAssets = async (form: RemoveServiceAssetForm) => {
    const result = await HandlerWrapper.callHandler(RemoveServiceAssetsHandler, form);
    return result;
}

export const removeService = async (form: RemoveServiceForm) => {
    const result = await HandlerWrapper.callHandler(RemoveServiceHandler, form);
    return result;
}

export const transferFromService = async (form: TransferFromServiceForm) => {
    const result = await HandlerWrapper.callHandler(TransferFromServiceHandler, form);
    return result;
}

export const transferToService = async (form: TransferForm) => {
    const result = await HandlerWrapper.callHandler(TransferToServiceHandler, form);
    return result;
}