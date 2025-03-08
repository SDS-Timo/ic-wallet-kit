import { AccountTransferModel, GetHplFeeConstantInfo, HplTransferForm, VirtualAccountTransferModel } from "@hpl/forms";
import { GetHplFeeConstantHandler } from "@hpl/handlers/transfer/getHplFeeConstantHandler/getHplFeeConstantHandler";
import { getHplFeeConstant, transfer } from "@hpl/handlers/transfer/transfer.funcs";
import { TransferHandler } from "@hpl/handlers/transfer/transferHandler/transferHandler";
import { FormResult, HandlerWrapper, LoadType } from "@ic-wallet-kit/common";

describe("Allowance funcs", () => {

    it("getHplFeeConstant calls handler and returns result", async () => {
        const mockForm: GetHplFeeConstantInfo = {
            loadType: LoadType.Full
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getHplFeeConstant(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetHplFeeConstantHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("transfer calls handler and returns result", async () => {
        const mockForm: HplTransferForm = {
            assetId: 1n,
            amount: 333n,
            txFrom: new AccountTransferModel(),
            txTo: new VirtualAccountTransferModel()
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await transfer(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(TransferHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
