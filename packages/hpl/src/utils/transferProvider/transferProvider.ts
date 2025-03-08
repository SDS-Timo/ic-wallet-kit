import { ITransferModel } from "@hpl/forms/transfers/hplTransferForm";
import { TransferAccountReference } from "@research-ag/hpl-client";

export class TransferAccountReferenceProvider {

    static toTransferAccountReference(model: ITransferModel): TransferAccountReference {

        if (model.owner) {
            return {
                type: model.type,
                owner: model.owner,
                id: model.id,
            }
        }

        return {
            type: model.type,
            id: model.id
        } as TransferAccountReference
    }
}