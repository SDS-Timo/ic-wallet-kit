import { HandlerWrapper } from "@ic-wallet-kit/common";
import { AddAssetContactHandler, AddSubAccountContactHandler, EditContactHandler, EditOrAddContactHandler, EditOrAddSubAccountContactHandler, EditSubAccountContactHandler, GetListContactHandler, RemoveAssetContactHandler, RemoveContactHandler, RemoveSubAccountContactHandler } from "@icrc/handlers";
import { AddAssetContactForm, AddSubAccountContactForm, EditContactForm, EditSubAccountContactForm, GetListContactForm, RemoveAssetContactForm, RemoveContactForm, RemoveSubAccountContactForm } from "@icrc/types";

export const addAssetContact = async (form: AddAssetContactForm) => {
    const result = await HandlerWrapper.callHandler(AddAssetContactHandler, form);
    return result;
}

export const addSubAccountContact = async (form: AddSubAccountContactForm) => {
    const result = await HandlerWrapper.callHandler(AddSubAccountContactHandler, form);
    return result;
}

export const editContact = async (form: EditContactForm) => {
    const result = await HandlerWrapper.callHandler(EditContactHandler, form);
    return result;
}

export const editOrAddContact = async (form: EditContactForm) => {
    const result = await HandlerWrapper.callHandler(EditOrAddContactHandler, form);
    return result;
}

export const editOrAddSubAccountContact = async (form: AddSubAccountContactForm) => {
    const result = await HandlerWrapper.callHandler(EditOrAddSubAccountContactHandler, form);
    return result;
}

export const editSubAccountContact = async (form: EditSubAccountContactForm) => {
    const result = await HandlerWrapper.callHandler(EditSubAccountContactHandler, form);
    return result;
}

export const getListContact = async (form: GetListContactForm) => {
    const result = await HandlerWrapper.callHandler(GetListContactHandler, form);
    return result;
}

export const removeAssetContact = async (form: RemoveAssetContactForm) => {
    const result = await HandlerWrapper.callHandler(RemoveAssetContactHandler, form);
    return result;
}

export const removeContact = async (form: RemoveContactForm) => {
    const result = await HandlerWrapper.callHandler(RemoveContactHandler, form);
    return result;
}

export const removeSubAccountContact = async (form: RemoveSubAccountContactForm) => {
    const result = await HandlerWrapper.callHandler(RemoveSubAccountContactHandler, form);
    return result;
}