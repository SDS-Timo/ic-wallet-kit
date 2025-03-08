import { HandlerWrapper, LoadType } from "@ic-wallet-kit/common";
import { mockIndexAddress, mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import {
    addAsset,
    addSubAccount,
    checkAsset,
    getListAsset,
    removeAsset,
    removeSubAccount,
    RemoveSubAccountHandler,
    updateAsset,
    UpdateAssetHandler,
    updateSubAccount,
    UpdateSubAccountHandler
} from "@icrc/handlers/assetHandlers";
import { AddAssetHandler } from "@icrc/handlers/assetHandlers/addAssetHandler/addAssetHandler";
import { AddSubAccountHandler } from "@icrc/handlers/assetHandlers/addSubAccountHandler/addSubAccountHandler";
import { CheckAssetHandler } from "@icrc/handlers/assetHandlers/checkAssetHandler/checkAssetHandler";
import { GetListAssetHandler } from "@icrc/handlers/assetHandlers/getListAssetHandler/getListAssetHandler";
import { RemoveAssetHandler } from "@icrc/handlers/assetHandlers/removeAssetHandler/removeAssetHandler";
import { SubAccountId } from "@icrc/types";
import {
    AddAssetForm,
    AddSubAccountForm,
    CheckAssetForm,
    GetAssetListForm,
    RemoveAssetForm,
    RemoveSubAccountForm,
    UpdateAssetForm,
    UpdateSubAccountForm
} from "@icrc/types/forms";

describe("Asset Handlers", () => {
    it("addAsset calls handler and returns result", async () => {
        const mockForm: AddAssetForm = {
            indexAddress: mockIndexAddress,
            ledgerAddress: mockLedgerAddress,
            name: "name",
            symbol: "symbol",
            shortDecimal: 8
        };
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addAsset(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddAssetHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("addSubAccount calls handler and returns result", async () => {
        const mockForm: AddSubAccountForm = {
            subAccountName: "subAccountName",
            ledgerAddress: mockLedgerAddress,
            subAccountId: SubAccountId.parseFromNumber(11)
        };
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addSubAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddSubAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("checkAsset calls handler and returns result", async () => {
        const mockForm: CheckAssetForm = {
            indexAddress: mockIndexAddress,
            ledgerAddress: mockLedgerAddress
        };

        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await checkAsset(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(CheckAssetHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("getListAsset calls handler and returns result", async () => {
        const mockForm: GetAssetListForm = { loadType: LoadType.Full };

        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getListAsset(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetListAssetHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeAsset calls handler and returns result", async () => {
        const mockForm: RemoveAssetForm = {
            ledgerAddress: mockLedgerAddress
        };

        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeAsset(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveAssetHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("removeSubAccount calls handler and returns result", async () => {
        const mockForm: RemoveSubAccountForm = {
            ledgerAddress: mockLedgerAddress,
            subAccountId: SubAccountId.parseFromNumber(1)
        };

        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await removeSubAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(RemoveSubAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("updateAsset calls handler and returns result", async () => {
        const mockForm: UpdateAssetForm = {
            assetName: "assetName",
            ledgerAddress: mockLedgerAddress,
            shortDecimal: 8,
            symbol: "symbol"
        };
        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await updateAsset(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(UpdateAssetHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("updateSubAccount calls handler and returns result", async () => {
        const mockForm: UpdateSubAccountForm = {
            ledgerAddress: mockLedgerAddress,
            subAccountId: SubAccountId.parseFromNumber(1),
            subAccountNewName: "newName"
        };

        const mockResult = { success: true };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await updateSubAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(UpdateSubAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
