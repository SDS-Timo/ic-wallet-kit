import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { allowanceName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { AmountProvider, LoadType } from "@ic-wallet-kit/common";
import { GetListAllowanceForm, GetListAllowanceHandler, GetListAllowanceResult } from "@ic-wallet-kit/icrc";

export class AllowanceListConsoleForm {
    public ledgerAddress: string = "";
    constructor() {
    }
}

export class AllowanceList extends BaseActionModel<GetListAllowanceHandler, GetListAllowanceForm, GetListAllowanceResult, AllowanceListConsoleForm> {

    public parentCommandName: string = allowanceName;
    public commandName: string = "list";
    public description: string = "gets allowances for asset";
    public optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AllowanceListConsoleForm {
        return new AllowanceListConsoleForm();
    }

    protected getForm(params: string): Promise<GetListAllowanceForm> {

        const form = this.getConsoleForm(params);
        return Promise.resolve({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        });
    }

    protected get handlerName(): Constructable<GetListAllowanceHandler> {
        return GetListAllowanceHandler;
    }

    protected formatOutputResult(data: GetListAllowanceResult) {

        if (data.allowances.length == 0) {
            consoleOutput("Allowance list is empty");
        }
        else {
            console.table(data.allowances.map((a) => {
                return {
                    ledgerAddress: a.ledgerAddress,
                    subAccount: a.subAccountId.toString(),
                    spender: a.spenderSubId,
                    amount: AmountProvider.bigIntToDisplay(a.amount, a.decimal),
                    expiration: a.expiration || "No Expiration"
                }

            }), ["ledgerAddress", "subAccount", "spender", "amount", "expiration"]);
        }



        return Promise.resolve();
    }
}