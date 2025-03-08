import { HandlerWrapper } from "@ic-wallet-middleware/common";
import {
    AddAssetContactHandler,
    AddSubAccountContactHandler,
    EditContactHandler,
    EditOrAddContactHandler,
    EditOrAddSubAccountContactHandler,
    EditSubAccountContactHandler,
    GetListContactHandler,
    RemoveAssetContactHandler,
    RemoveContactHandler,
    RemoveSubAccountContactHandler
} from "@icrc/handlers";

import {
    AddAssetContactForm,
    AddSubAccountContactForm,
    EditContactForm,
    EditSubAccountContactForm,
    GetListContactForm,
    RemoveAssetContactForm,
    RemoveContactForm,
    RemoveSubAccountContactForm
} from "@icrc/types";

import {
    addAssetContact,
    addSubAccountContact,
    editContact,
    editOrAddContact,
    editOrAddSubAccountContact,
    editSubAccountContact,
    getListContact,
    removeAssetContact,
    removeContact,
    removeSubAccountContact
} from "./contact.funcs";

describe("Contact Handlers", () => {
    it("addAssetContact calls handler and returns result", async () => {
        const mockForm: AddAssetContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addAssetContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddAssetContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("addSubAccountContact calls handler and returns result", async () => {
        const mockForm: AddSubAccountContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addSubAccountContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddSubAccountContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editContact calls handler and returns result", async () => {
        const mockForm: EditContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editOrAddContact calls handler and returns result", async () => {
        const mockForm: EditContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editOrAddContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditOrAddContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editOrAddSubAccountContact calls handler and returns result", async () => {
        const mockForm: AddSubAccountContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editOrAddSubAccountContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditOrAddSubAccountContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editSubAccountContact calls handler and returns result", async () => {
        const mockForm: EditSubAccountContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editSubAccountContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditSubAccountContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("getListContact calls handler and returns result", async () => {
        const mockForm: GetListContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getListContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetListContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeAssetContact calls handler and returns result", async () => {
        const mockForm: RemoveAssetContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeAssetContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveAssetContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeContact calls handler and returns result", async () => {
        const mockForm: RemoveContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeSubAccountContact calls handler and returns result", async () => {
        const mockForm: RemoveSubAccountContactForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeSubAccountContact(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveSubAccountContactHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
