import { AddHplAccountForm, EditHplAccountForm, GetHplAccountListInfo } from "@hpl/forms";
import { addHplAccount, editHplAccount, getHplAccountList } from "@hpl/handlers/accounts/accounts.funcs";
import { AddHplAccountHandler } from "@hpl/handlers/accounts/addHplAccountHandler/addHplAccountHandler";
import { EditHplAccountHandler } from "@hpl/handlers/accounts/editHplAccountHandler/editHplAccountHandler";
import { GetHplAccountListHandler } from "@hpl/handlers/accounts/getHplAccountListHandler/getHplAccountListHandler";
import { FormResult, HandlerWrapper, LoadType } from "@ic-wallet-kit/common";

describe("Allowance funcs", () => {

    it("getHplAccountList calls handler and returns result", async () => {
        const mockForm: GetHplAccountListInfo = {
            loadType: LoadType.Full
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getHplAccountList(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetHplAccountListHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("addHplAccount calls handler and returns result", async () => {
        const mockForm: AddHplAccountForm = {
            assetId: 1n,
            accountName: "mock-name"
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await addHplAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(AddHplAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("editHplAccount calls handler and returns result", async () => {
        const mockForm: EditHplAccountForm = {
            accountId: "20n",
            name: "mock-new-name"
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await editHplAccount(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(EditHplAccountHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
