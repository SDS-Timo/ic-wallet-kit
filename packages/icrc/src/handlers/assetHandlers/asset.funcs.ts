import { HandlerWrapper } from "@ic-wallet-kit/common";
import { RemoveSubAccountHandler, UpdateAssetHandler, UpdateSubAccountHandler } from "@icrc/handlers/assetHandlers";
import { AddAssetHandler } from "@icrc/handlers/assetHandlers/addAssetHandler/addAssetHandler";
import { AddSubAccountHandler } from "@icrc/handlers/assetHandlers/addSubAccountHandler/addSubAccountHandler";
import { CheckAssetHandler } from "@icrc/handlers/assetHandlers/checkAssetHandler/checkAssetHandler";
import { GetListAssetHandler } from "@icrc/handlers/assetHandlers/getListAssetHandler/getListAssetHandler";
import { RemoveAssetHandler } from "@icrc/handlers/assetHandlers/removeAssetHandler/removeAssetHandler";
import { AddAssetForm, AddSubAccountForm, CheckAssetForm, GetAssetListForm, RemoveAssetForm, RemoveSubAccountForm, UpdateAssetForm, UpdateSubAccountForm } from "@icrc/types/forms";

export const addAsset = async (form: AddAssetForm) => {
    const result = await HandlerWrapper.callHandler(AddAssetHandler, form);
    return result;
}

export const addSubAccount = async (form: AddSubAccountForm) => {
    const result = await HandlerWrapper.callHandler(AddSubAccountHandler, form);
    return result;
}

export const checkAsset = async (form: CheckAssetForm) => {
    const result = await HandlerWrapper.callHandler(CheckAssetHandler, form);
    return result;
}

export const getListAsset = async (form: GetAssetListForm) => {
    const result = await HandlerWrapper.callHandler(GetListAssetHandler, form);
    return result;
}

export const removeAsset = async (form: RemoveAssetForm) => {
    const result = await HandlerWrapper.callHandler(RemoveAssetHandler, form);
    return result;
}

export const removeSubAccount = async (form: RemoveSubAccountForm) => {
    const result = await HandlerWrapper.callHandler(RemoveSubAccountHandler, form);
    return result;
}

export const updateAsset = async (form: UpdateAssetForm) => {
    const result = await HandlerWrapper.callHandler(UpdateAssetHandler, form);
    return result;
}

export const updateSubAccount = async (form: UpdateSubAccountForm) => {
    const result = await HandlerWrapper.callHandler(UpdateSubAccountHandler, form);
    return result;
}