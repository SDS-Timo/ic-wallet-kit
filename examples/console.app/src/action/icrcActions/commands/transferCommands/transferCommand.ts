import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { transferName } from "@app/action/icrcActions/commands/parentName";
import { PrincipalInput } from "@app/action/models/principalInput";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { AmountProvider, IdentifierService, LoadType } from "@ic-wallet-kit/common";
import { GetListAssetHandler, SendTransactionForm, SendTransactionHandler, SendTransactionResult, SubAccountId } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export class TransferConsoleForm {

    public ledgerAddress: string = "";
    public subAccount: SubAccountId = SubAccountId.Default();
    public toIcrcAccount: PrincipalInput = PrincipalInput.Default();
    public amount: string = "";

    constructor() {
    }
}

export class Transfer extends BaseActionModel<SendTransactionHandler, SendTransactionForm, SendTransactionResult, TransferConsoleForm> {


    public parentCommandName: string = transferName;
    public commandName: string = "";
    public description: string = "from asset to icrc-1 account";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): TransferConsoleForm {
        return new TransferConsoleForm();
    }

    protected getForm(params: string): Promise<SendTransactionForm> {

        const form = this.getConsoleForm(params);

        const identifierService = Container.get(IdentifierService);
        const receiverPrincipal = form.toIcrcAccount.principal ? form.toIcrcAccount.principal : identifierService.getPrincipal();

        return Promise.resolve(
            {
                ledgerAddress: form.ledgerAddress,
                subAccountId: form.subAccount,
                receiverAccountPrincipal: receiverPrincipal,
                receiverSubAccountId: form.toIcrcAccount.subAccount ?? SubAccountId.Default(),
                amount: form.amount
            });
    }

    protected get handlerName(): Constructable<SendTransactionHandler> {
        return SendTransactionHandler;
    }

    protected async formatOutputResult(data: SendTransactionResult) {

        const tran = data.transactions[0];

        let getListAssetHandler = Container.get(GetListAssetHandler);
        let asset = (await getListAssetHandler.process({ loadType: LoadType.Cache }))
            .assets
            .find((a) => a.ledgerAddress == tran.canisterId);


        console.table(data.transactions.map((t) => {
            return {
                symbol: t.symbol,
                ledgerAddress: t.canisterId,
                amount: AmountProvider.bigIntToDisplay(t.amount, asset?.decimal || 0),
                fee: AmountProvider.bigIntToDisplay(t.fee, asset?.decimal || 0),
                status: t.status,
                type: t.type
            }
        }));
    }
}