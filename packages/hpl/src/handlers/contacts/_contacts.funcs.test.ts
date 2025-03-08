import { Principal } from "@dfinity/principal";
import { AddHplContactForm, AddHplContactLinkForm, EditHplContactForm, GetHplContactAvailableLinkInfo, GetHplContactListInfo, RemoveHplContactForm, RemoveHplContactLinkForm } from "@hpl/forms";
import { AddHplContactHandler } from "@hpl/handlers/contacts/addHplContactHandler/addHplContactHandler";
import { AddHplContactRemotesHandler } from "@hpl/handlers/contacts/addHplContactRemotesHandler/addHplContactRemotesHandler";
import { addHplContact, addHplContactRemotes, editHplContact, getHplContactAvailableLink, getHplContactList, removeHplContact, removeHplContactLink } from "@hpl/handlers/contacts/contacts.funcs";
import { EditHplContactHandler } from "@hpl/handlers/contacts/editHplContactHandler/editHplContactHandler";
import { GetHplContactAvailableLinkHandler } from "@hpl/handlers/contacts/getHplContactAvailableLinkHandler/getHplContactAvailableLinkHandler";
import { GetHplContactListHandler } from "@hpl/handlers/contacts/getHplContactListHandler/getHplContactListHandler";
import { RemoveHplContactHandler } from "@hpl/handlers/contacts/removeHplContactHandler/removeHplContactHandler";
import { RemoveHplContactLinkHandler } from "@hpl/handlers/contacts/removeHplContactLinkHandler/removeHplContactLinkHandler";
import { FormResult, HandlerWrapper, LoadType } from "@ic-wallet-kit/common";

describe("Allowance funcs", () => {

    it("getHplContactList calls handler and returns result", async () => {
        const mockForm: GetHplContactListInfo = {
            loadType: LoadType.Full
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getHplContactList(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetHplContactListHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("getHplContactAvailableLink calls handler and returns result", async () => {
        const mockForm: GetHplContactAvailableLinkInfo = {
            loadType: LoadType.Full,
            principal: Principal.anonymous()
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getHplContactAvailableLink(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetHplContactAvailableLinkHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("addHplContact calls handler and returns result", async () => {
        const mockForm: AddHplContactForm = {
            contactName: "mock-name",
            linkIds: [],
            principal: Principal.anonymous()
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addHplContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddHplContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("addHplContactRemotes calls handler and returns result", async () => {
        const mockForm: AddHplContactLinkForm = {
            contactPrincipal: Principal.anonymous(),
            linkIds: []
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addHplContactRemotes(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddHplContactRemotesHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editHplContact calls handler and returns result", async () => {
        const mockForm: EditHplContactForm = {
            contactName: "mock-name",
            linkIds: [],
            principal: Principal.anonymous()
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editHplContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditHplContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeHplContact calls handler and returns result", async () => {
        const mockForm: RemoveHplContactForm = {
            principal: Principal.anonymous()
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeHplContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveHplContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeHplContactLink calls handler and returns result", async () => {
        const mockForm: RemoveHplContactLinkForm = {
            principal: Principal.anonymous(),
            linkId: "mock-linkId"
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeHplContactLink(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveHplContactLinkHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
