import { Principal } from "@dfinity/principal";
import { AddHplVirtualAccountForm, CheckLinkCodeForm, DeleteHplVirtualAccountForm, EditHplVirtualAccountForm, GetHplVirtualAccountListInfo, ResetHplVirtualAccountForm } from "@hpl/forms";
import { AddHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/addHplVirtualAccountHandler/addHplVirtualAccountHandler";
import { CheckLinkCodeHandler } from "@hpl/handlers/virtualAccounts/checkLinkCodeHandler/checkLinkCodeHandler";
import { DeleteHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/deleteHplVirtualAccountHandler/deleteHplVirtualAccountHandler";
import { EditHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/editHplVirtualAccountHandler/editHplVirtualAccountHandler";
import { GetHplVirtualAccountListHandler } from "@hpl/handlers/virtualAccounts/getHplVirtualAccountListHandler/getHplVirtualAccountListHandler";
import { ResetHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/resetHplVirtualAccountHandler/resetHplVirtualAccountHandler";
import { addHplVirtualAccount, checkLinkCode, deleteHplVirtualAccount, editHplVirtualAccount, getHplVirtualAccountList, resetHplVirtualAccount } from "@hpl/handlers/virtualAccounts/virtualAccounts.funcs";
import { FormResult, HandlerWrapper, LoadType } from "@ic-wallet-kit/common";

describe("Allowance funcs", () => {

    it("addHplVirtualAccount calls handler and returns result", async () => {
        const mockForm: AddHplVirtualAccountForm = {
            assetId: 1n,
            accountId: 2n,
            accessByPrincipal: Principal.anonymous(),
            amount: 555n,
            virtualAccountName: "mock-name",
            expiration: 0n
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addHplVirtualAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddHplVirtualAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("checkLinkCode calls handler and returns result", async () => {
        const mockForm: CheckLinkCodeForm = {
            linkCode: "mock-linkCode"
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await checkLinkCode(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(CheckLinkCodeHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("deleteHplVirtualAccount calls handler and returns result", async () => {
        const mockForm: DeleteHplVirtualAccountForm = {
            virtualAccountId: 3n
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await deleteHplVirtualAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(DeleteHplVirtualAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editHplVirtualAccount calls handler and returns result", async () => {
        const mockForm: EditHplVirtualAccountForm = {
            virtualAccountId: 3n,
            accountId: 2n,
            amount: 555n,
            virtualAccountName: "mock-name",
            expiration: 0n
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editHplVirtualAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditHplVirtualAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("getHplVirtualAccountList calls handler and returns result", async () => {
        const mockForm: GetHplVirtualAccountListInfo = {
            loadType: LoadType.Full
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getHplVirtualAccountList(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetHplVirtualAccountListHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("resetHplVirtualAccount calls handler and returns result", async () => {
        const mockForm: ResetHplVirtualAccountForm = {
            virtualAccountId: 3n
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await resetHplVirtualAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(ResetHplVirtualAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
