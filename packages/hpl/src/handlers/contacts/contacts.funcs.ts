import { AddHplContactForm, AddHplContactLinkForm, EditHplContactForm, GetHplContactAvailableLinkInfo, GetHplContactListInfo, RemoveHplContactForm, RemoveHplContactLinkForm } from "@hpl/forms";
import { AddHplContactHandler } from "@hpl/handlers/contacts/addHplContactHandler/addHplContactHandler";
import { AddHplContactRemotesHandler } from "@hpl/handlers/contacts/addHplContactRemotesHandler/addHplContactRemotesHandler";
import { EditHplContactHandler } from "@hpl/handlers/contacts/editHplContactHandler/editHplContactHandler";
import { GetHplContactAvailableLinkHandler } from "@hpl/handlers/contacts/getHplContactAvailableLinkHandler/getHplContactAvailableLinkHandler";
import { GetHplContactListHandler } from "@hpl/handlers/contacts/getHplContactListHandler/getHplContactListHandler";
import { RemoveHplContactHandler } from "@hpl/handlers/contacts/removeHplContactHandler/removeHplContactHandler";
import { RemoveHplContactLinkHandler } from "@hpl/handlers/contacts/removeHplContactLinkHandler/removeHplContactLinkHandler";
import { HandlerWrapper } from "@ic-wallet-kit/common";

export const getHplContactList = async (form: GetHplContactListInfo) => {
    const result = await HandlerWrapper.callHandler(GetHplContactListHandler, form);
    return result;
}

export const getHplContactAvailableLink = async (form: GetHplContactAvailableLinkInfo) => {
    const result = await HandlerWrapper.callHandler(GetHplContactAvailableLinkHandler, form);
    return result;
}

export const addHplContact = async (form: AddHplContactForm) => {
    const result = await HandlerWrapper.callHandler(AddHplContactHandler, form);
    return result;
}

export const addHplContactRemotes = async (form: AddHplContactLinkForm) => {
    const result = await HandlerWrapper.callHandler(AddHplContactRemotesHandler, form);
    return result;
}

export const editHplContact = async (form: EditHplContactForm) => {
    const result = await HandlerWrapper.callHandler(EditHplContactHandler, form);
    return result;
}

export const removeHplContact = async (form: RemoveHplContactForm) => {
    const result = await HandlerWrapper.callHandler(RemoveHplContactHandler, form);
    return result;
}

export const removeHplContactLink = async (form: RemoveHplContactLinkForm) => {
    const result = await HandlerWrapper.callHandler(RemoveHplContactLinkHandler, form);
    return result;
}