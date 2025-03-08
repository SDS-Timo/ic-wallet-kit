import { EditHplAssetForm, GetHplAssetListInfo } from "@hpl/forms";
import { editHplAsset, getHplAssetList } from "@hpl/handlers/assets/assets.funcs";
import { EditHplAssetHandler } from "@hpl/handlers/assets/editHplAssetHandler/editHplAssetHandler";
import { GetHplAssetListHandler } from "@hpl/handlers/assets/getHplAssetListHandler/getHplAssetListHandler";
import { FormResult, HandlerWrapper, LoadType } from "@ic-wallet-kit/common";

describe("Allowance funcs", () => {

    it("getHplAssetList calls handler and returns result", async () => {
        const mockForm: GetHplAssetListInfo = {
            loadType: LoadType.Full
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getHplAssetList(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetHplAssetListHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editHplAsset calls handler and returns result", async () => {
        const mockForm: EditHplAssetForm = {
            assetId: 1n,
            name: "mock-name",
            symbol: "MS"
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editHplAsset(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditHplAssetHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
