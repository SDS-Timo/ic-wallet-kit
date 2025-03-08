import { GetHplFeeConstantInfo, HplTransferForm } from "@hpl/forms";
import { GetHplFeeConstantHandler } from "@hpl/handlers/transfer/getHplFeeConstantHandler/getHplFeeConstantHandler";
import { TransferHandler } from "@hpl/handlers/transfer/transferHandler/transferHandler";
import { HandlerWrapper } from "@ic-wallet-kit/common";

export const getHplFeeConstant = async (form: GetHplFeeConstantInfo) => {
    const result = await HandlerWrapper.callHandler(GetHplFeeConstantHandler, form);
    return result;
}

export const transfer = async (form: HplTransferForm) => {
    const result = await HandlerWrapper.callHandler(TransferHandler, form);
    return result;
}