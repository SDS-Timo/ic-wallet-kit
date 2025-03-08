import { FormResult, HandlerWrapper, LoadType } from "@ic-wallet-middleware/common";
import { mockOwnerPrincipalString, mockReceiverPrincipal, mockSpenderPrincipal } from "@icrc/__tests_utils/mockConstrains";
import {
    addAllowance,
    checkAllowance,
    checkAllowanceByPrincipal,
    CheckAllowanceByPrincipalHandler,
    CheckAllowanceHandler,
    getListAllowance,
    GetListAllowanceHandler,
    removeAllowance,
    RemoveAllowanceHandler,
    transferFromAllowance,
    TransferFromAllowanceHandler,
    updateAllowanceHandler,
    UpdateAllowanceHandler
} from "@icrc/handlers";
import { AddAllowanceHandler } from "@icrc/handlers/allowanceHandlers/addAllowanceHandler/addAllowanceHandler";
import { SubAccountId } from "@icrc/types";
import {
    AddAllowanceForm,
    CheckAllowanceByPrincipalForm,
    CheckAllowanceForm,
    GetListAllowanceForm,
    RemoveAllowanceForm,
    TransferFromAllowanceForm,
    UpdateAllowanceForm
} from "@icrc/types/forms";

describe("Allowance funcs", () => {

    it("addAllowance calls handler and returns result", async () => {
        const mockForm: AddAllowanceForm = {
            amount: 10n,
            ledgerAddress: "",
            spenderPrincipal: "",
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.parseFromNumber(12),
            expiration: "mock-expiration"
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addAllowance(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddAllowanceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("checkAllowanceByPrincipal calls handler and returns result", async () => {
        const mockForm: CheckAllowanceByPrincipalForm = {
            ledgerAddress: "",
            spenderPrincipal: "",
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.parseFromNumber(12),
            ownerPrincipal: mockOwnerPrincipalString()
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await checkAllowanceByPrincipal(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(CheckAllowanceByPrincipalHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("checkAllowance calls handler and returns result", async () => {
        const mockForm: CheckAllowanceForm = {
            ledgerAddress: "",
            spenderPrincipal: "",
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.parseFromNumber(12),
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await checkAllowance(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(CheckAllowanceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("getListAllowance calls handler and returns result", async () => {
        const mockForm: GetListAllowanceForm = {
            ledgerAddress: "",
            loadType: LoadType.Full
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getListAllowance(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetListAllowanceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeAllowance calls handler and returns result", async () => {
        const mockForm: RemoveAllowanceForm = {
            ledgerAddress: "",
            spenderPrincipal: "",
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.parseFromNumber(12),
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeAllowance(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveAllowanceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("transferFromAllowance calls handler and returns result", async () => {
        const mockForm: TransferFromAllowanceForm = {
            ledgerAddress: "",
            amount: 10n,
            fromSubAccountId: SubAccountId.parseFromNumber(10),
            receiverPrincipal: mockReceiverPrincipal(),
            senderPrincipal: mockSpenderPrincipal(),
            toSubAccountId: SubAccountId.parseFromNumber(1)
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await transferFromAllowance(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(TransferFromAllowanceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("updateAllowanceHandler calls handler and returns result", async () => {
        const mockForm: UpdateAllowanceForm = {
            amount: 10n,
            ledgerAddress: "",
            spenderPrincipal: "",
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.parseFromNumber(12),
            expiration: "mock-expiration"
        };

        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await updateAllowanceHandler(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(UpdateAllowanceHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
