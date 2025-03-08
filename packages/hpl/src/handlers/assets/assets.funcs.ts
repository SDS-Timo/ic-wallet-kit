import { EditHplAssetForm, GetHplAssetListInfo } from "@hpl/forms";
import { EditHplAssetHandler } from "@hpl/handlers/assets/editHplAssetHandler/editHplAssetHandler";
import { GetHplAssetListHandler } from "@hpl/handlers/assets/getHplAssetListHandler/getHplAssetListHandler";
import { HandlerWrapper } from "@ic-wallet-kit/common";

export const getHplAssetList = async (form: GetHplAssetListInfo) => {
    const result = await HandlerWrapper.callHandler(GetHplAssetListHandler, form);
    return result;
}

export const editHplAsset = async (form: EditHplAssetForm) => {
    const result = await HandlerWrapper.callHandler(EditHplAssetHandler, form);
    return result;
}