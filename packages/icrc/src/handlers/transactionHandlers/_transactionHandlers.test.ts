import { HandlerWrapper } from "@ic-wallet-middleware/common";
import { getListTransaction, sendTransaction, SendTransactionHandler } from "@icrc/handlers";
import { GetListTransactionHandler } from "@icrc/handlers/transactionHandlers/getListTransactionHandler/getListTransactionHandler";
import { GetListTransactionForm, SendTransactionForm } from "@icrc/types";

describe("Transaction Handlers", () => {
    it("getListTransaction calls handler and returns result", async () => {
        const mockForm: GetListTransactionForm = { /* Mock form data */ } as any;
        const mockResult = { transactions: [] };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await getListTransaction(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(GetListTransactionHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("sendTransaction calls handler and returns result", async () => {
        const mockForm: SendTransactionForm = { /* Mock form data */ } as any;;
        const mockResult = { transactionId: "tx123" };

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await sendTransaction(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(SendTransactionHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
