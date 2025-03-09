import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { transferName } from "@app/action/icrcActions/commands/parentName";
import { PrincipalInput } from "@app/action/models/principalInput";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { IdentifierService } from "@ic-wallet-kit/common";
import { AllowanceResult, SubAccountId, TransferFromAllowanceForm, TransferFromAllowanceHandler } from "@ic-wallet-kit/icrc";

import Container from "typedi";

export class TransferFromConsoleForm {

    public ledgerAddress: string = "";
    public fromIcrcAccount: PrincipalInput = PrincipalInput.Default();
    public toIcrcAccount: PrincipalInput = PrincipalInput.Default();
    public amount: string = "";

    constructor() {
    }
}

export class TransferFrom extends BaseActionModel<TransferFromAllowanceHandler, TransferFromAllowanceForm, AllowanceResult, TransferFromConsoleForm> {

    public parentCommandName: string = transferName;
    public commandName: string = "from";
    public description: string = "transfer from icrc-1 to icrc-1 account";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): TransferFromConsoleForm {
        return new TransferFromConsoleForm();
    }

    protected getForm(params: string): Promise<TransferFromAllowanceForm> {
        const form = this.getConsoleForm(params);

        const identifierService = Container.get(IdentifierService);
        const senderPrincipal = form.fromIcrcAccount.principal ?? identifierService.getPrincipal();
        const receiverPrincipal = form.toIcrcAccount.principal ?? identifierService.getPrincipal();

        return Promise.resolve({
            ledgerAddress: form.ledgerAddress,
            senderPrincipal: senderPrincipal,
            fromSubAccountId: form.fromIcrcAccount.subAccount ?? SubAccountId.Default(),
            toSubAccountId: form.toIcrcAccount.subAccount ?? SubAccountId.Default(),
            receiverPrincipal: receiverPrincipal,
            amount: form.amount
        });
    }

    protected get handlerName(): Constructable<TransferFromAllowanceHandler> {
        return TransferFromAllowanceHandler;
    }

    protected formatOutputResult(data: AllowanceResult) {
        consoleOutput("Transfer was passed success");
        return Promise.resolve();
    }
}
