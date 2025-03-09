import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { allowanceName } from "@app/action/icrcActions/commands/parentName";
import { PrincipalInput } from "@app/action/models/principalInput";
import { ConsoleValidationError } from "@app/error/consoleValidationError";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { IdentifierService } from "@ic-wallet-kit/common";
import { AddAllowanceForm, AddAllowanceHandler, AllowanceResult, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

export class AllowanceAddConsoleForm {

    public ledgerAddress: string = "";
    public subAccountId: SubAccountId = SubAccountId.Default();
    public spender: PrincipalInput = PrincipalInput.Default();
    public amount: string = "";

    constructor() {
    }
}

export class AllowanceSet extends BaseActionModel<AddAllowanceHandler, AddAllowanceForm, AllowanceResult, AllowanceAddConsoleForm> {

    public parentCommandName: string = allowanceName;
    public commandName: string = "set";
    public description: string = "sets allowance";
    protected optionalParamNames: OptionalParamModel[] = [
        { formName: "expiration", paramName: "expiration" }
    ];

    protected get consoleFormDefaultObject(): AllowanceAddConsoleForm {
        return new AllowanceAddConsoleForm();
    }

    protected getForm(params: string): Promise<AddAllowanceForm> {

        const form = this.getConsoleForm(params);

        if (!form.spender.principal) {
            throw new ConsoleValidationError("spender", "spender principal are required");
        }

        const identifierService = Container.get(IdentifierService);

        if (form.spender.principal?.toText() == identifierService.getPrincipalStr()) {
            throw new ConsoleValidationError("spender", "spender principal can not equals current user principal");
        }

        const result = {
            ledgerAddress: form.ledgerAddress,
            spenderPrincipal: form.spender.principal?.toText(),
            spenderSubId: form.spender.subAccount ?? SubAccountId.Default(),
            subAccountId: form.subAccountId,
            amount: form.amount
        };

        this.parseOptionalParams(params.trim(), this.optionalParamNames, result);
        return Promise.resolve(result);
    }

    protected get handlerName(): Constructable<AddAllowanceHandler> {
        return AddAllowanceHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Allowance was set success");
        return Promise.resolve();
    }
}