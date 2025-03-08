import { AccountTransferModel, VirtualAccountTransferModel } from "@hpl/forms";
import { TransferAccountReferenceProvider } from "@hpl/utils/transferProvider/transferProvider";


describe("Unit TransferAccountReferenceProvider tests", () => {

    it("TransferAccountReferenceProvider, should return account as TransferAccountReference", async () => {
        const model = new AccountTransferModel();
        model.id = BigInt(1n);

        const result = TransferAccountReferenceProvider.toTransferAccountReference(model);
        expect(result).toEqual({
            type: "sub",
            id: 1n
        });
    });

    it("TransferAccountReferenceProvider, should return virtualAccount as TransferAccountReference", async () => {
        const model = new VirtualAccountTransferModel();
        model.id = 1n;
        model.owner = "mock-owner";

        const result = TransferAccountReferenceProvider.toTransferAccountReference(model);
        expect(result).toEqual({
            type: "vir",
            id: 1n,
            owner: "mock-owner"
        });
    });
})