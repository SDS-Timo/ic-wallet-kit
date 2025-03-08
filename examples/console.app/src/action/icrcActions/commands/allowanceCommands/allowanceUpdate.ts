import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { allowanceName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { SubAccountId, UpdateAllowanceForm, UpdateAllowanceHandler, UpdateAllowanceResult } from "@ic-wallet-middleware/icrc";

export class AllowanceUpdateConsoleForm {

    public ledgerAddress: string = "";
    public spenderPrincipal: string = "";
    public subAccountId: SubAccountId = SubAccountId.Default();
    public spenderSubId: SubAccountId = SubAccountId.Default();
    public amount: string = "";

    constructor() {
    }
}

export class AllowanceUpdate extends BaseActionModel<UpdateAllowanceHandler, UpdateAllowanceForm, UpdateAllowanceResult, AllowanceUpdateConsoleForm> {

    public parentCommandName: string = allowanceName;
    public commandName: string = "edit";
    public description: string = "updates exist Allowance";
    protected optionalParamNames: OptionalParamModel[] = [
        { formName: "expiration", paramName: "expiration" }
    ];


    protected get consoleFormDefaultObject(): AllowanceUpdateConsoleForm {
        return new AllowanceUpdateConsoleForm();
    }

    protected getForm(params: string): Promise<UpdateAllowanceForm> {

        const form = this.getConsoleForm(params);
        const result = {
            ledgerAddress: form.ledgerAddress,
            spenderPrincipal: form.spenderPrincipal,
            spenderSubId: form.spenderSubId,
            subAccountId: form.subAccountId,
            amount: form.amount
        }
        this.parseOptionalParams(params.trim(), this.optionalParamNames, result);
        return Promise.resolve(result);
    }

    protected get handlerName(): Constructable<UpdateAllowanceHandler> {
        return UpdateAllowanceHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Allowance was updated success");
        return Promise.resolve();
    }
}