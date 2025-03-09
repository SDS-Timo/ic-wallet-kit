import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { allowanceName } from "@app/action/icrcActions/commands/parentName";
import { PrincipalInput } from "@app/action/models/principalInput";
import { ConsoleValidationError } from "@app/error/consoleValidationError";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { AmountProvider, IdentifierService } from "@ic-wallet-kit/common";
import { CheckAllowanceByPrincipalForm, CheckAllowanceByPrincipalHandler, CheckAllowanceByPrincipalResult, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

export class AllowanceCheckByPrincipalConsoleForm {

    public ledgerAddress: string = "";
    public owner: PrincipalInput = PrincipalInput.Default();
    public spender: PrincipalInput = PrincipalInput.Default();

    constructor() {
    }
}

export class AllowanceGet extends BaseActionModel<CheckAllowanceByPrincipalHandler, CheckAllowanceByPrincipalForm, CheckAllowanceByPrincipalResult, AllowanceCheckByPrincipalConsoleForm> {
    public parentCommandName: string = allowanceName;
    public commandName: string = "get";
    public description: string = "get allowance";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AllowanceCheckByPrincipalConsoleForm {
        return new AllowanceCheckByPrincipalConsoleForm();
    }

    protected getForm(params: string): Promise<CheckAllowanceByPrincipalForm> {

        const form = this.getConsoleForm(params);

        if (!form.spender.principal && !form.owner.principal) {
            throw new ConsoleValidationError("spender", "spender or owner principal are required");
        }

        const identifierService = Container.get(IdentifierService);
        const ownerPrincipal = form.owner.principal ?? identifierService.getPrincipal();
        const senderPrincipal = form.spender.principal ?? identifierService.getPrincipal();

        if (form.spender.principal?.toText() == form.owner.principal?.toText()) {
            throw new ConsoleValidationError("spender", "spender principal can not equals owner principal");
        }

        return Promise.resolve({
            ledgerAddress: form.ledgerAddress,
            ownerPrincipal: ownerPrincipal.toText(),
            spenderPrincipal: senderPrincipal.toText(),
            spenderSubId: form.spender.subAccount ?? SubAccountId.Default(),
            subAccountId: form.owner.subAccount ?? SubAccountId.Default()
        });
    }

    protected get handlerName(): Constructable<CheckAllowanceByPrincipalHandler> {
        return CheckAllowanceByPrincipalHandler;
    }

    protected formatOutputResult(data: CheckAllowanceByPrincipalResult) {
        if (data.allowance) {
            consoleOutput("Allowance exist");
            console.table(
                [{
                    ledgerAddress: data.allowance.ledgerAddress,
                    subAccount: data.allowance.subAccountId.toString(),
                    spender: data.allowance.spender,
                    amount: AmountProvider.bigIntToDisplay(data.allowance.amount, data.allowance.decimal),
                    expiration: data.allowance.expiration || ""
                }]
                , ["ledgerAddress", "subAccount", "spender", "amount", "expiration"]);
        }
        else {
            consoleOutput("Allowance not exist");
        }
        return Promise.resolve();
    }
}