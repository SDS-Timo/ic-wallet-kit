import { HandlerWrapper } from "@ic-wallet-middleware/common";
import { AddServiceAssetsHandler } from "@icrc/handlers/serviceHandlers/addServiceAssetsHandler/addServiceAssetsHandler";
import { AddServiceHandler } from "@icrc/handlers/serviceHandlers/addServiceHandler/addServiceHandler";
import { CheckServicePrincipalHandler } from "@icrc/handlers/serviceHandlers/checkServicePrincipalHandler/checkServicePrincipalHandler";
import { EditServiceNameHandler } from "@icrc/handlers/serviceHandlers/editServiceNameHandler/editServiceNameHandler";
import { GetListServiceHandler } from "@icrc/handlers/serviceHandlers/getListServiceHandler/getListServiceHandler";
import { NotifyServiceHandler } from "@icrc/handlers/serviceHandlers/notifyServiceHandler/notifyServiceHandler";
import { RemoveServiceAssetsHandler } from "@icrc/handlers/serviceHandlers/removeServiceAssetsHandler/removeServiceAssetsHandler";
import { RemoveServiceHandler } from "@icrc/handlers/serviceHandlers/removeServiceHandler/removeServiceHandler";
import { addService, addServiceAssets, checkServicePrincipal, editServiceName, getListService, notifyService, removeService, removeServiceAssets, transferFromService, transferToService } from "@icrc/handlers/serviceHandlers/service.funcs";
import { TransferFromServiceHandler } from "@icrc/handlers/serviceHandlers/transferFromServiceHandler/transferFromServiceHandler";
import { TransferToServiceHandler } from "@icrc/handlers/serviceHandlers/transferToServiceHandler/transferToServiceHandler";
import { AddServiceAssetListForm, AddServiceForm, CheckServicePrincipalForm, EditServiceNameForm, GetServiceListForm, NotifyForm, RemoveServiceAssetForm, RemoveServiceForm, TransferForm, TransferFromServiceForm } from "@icrc/types/forms";

describe("Service Handlers", () => {
    it("addServiceAssets calls handler and returns result", async () => {
        const mockForm: AddServiceAssetListForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addServiceAssets(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddServiceAssetsHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("addService calls handler and returns result", async () => {
        const mockForm: AddServiceForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addService(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddServiceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("checkServicePrincipal calls handler and returns result", async () => {
        const mockForm: CheckServicePrincipalForm = { mock: "mock-data" } as any;
        const mockResult = { isPrincipalExist: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await checkServicePrincipal(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(CheckServicePrincipalHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editServiceName calls handler and returns result", async () => {
        const mockForm: EditServiceNameForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editServiceName(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditServiceNameHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("getListServiceHandler calls handler and returns result", async () => {
        const mockForm: GetServiceListForm = { mock: "mock-data" } as any;
        const mockResult = { services: [] };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getListService(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetListServiceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("notifyService calls handler and returns result", async () => {
        const mockForm: NotifyForm = { mock: "mock-data" } as any;
        const mockResult = { notificationSent: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await notifyService(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(NotifyServiceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeServiceAssets calls handler and returns result", async () => {
        const mockForm: RemoveServiceAssetForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeServiceAssets(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveServiceAssetsHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeService calls handler and returns result", async () => {
        const mockForm: RemoveServiceForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeService(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveServiceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("transferFromService calls handler and returns result", async () => {
        const mockForm: TransferFromServiceForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await transferFromService(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(TransferFromServiceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("transferToService calls handler and returns result", async () => {
        const mockForm: TransferForm = { mock: "mock-data" } as any;
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await transferToService(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(TransferToServiceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
