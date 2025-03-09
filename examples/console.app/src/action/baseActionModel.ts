import { PrincipalInput } from "@app/action/models/principalInput";
import { ConsoleValidationError } from "@app/error/consoleValidationError";
import { BaseCommand } from "@app/types/baseCommand";
import { OptionalParam } from "@app/types/optionalParam";
import { OptionalParamModel } from "@app/types/optionalParamModel";

import { consoleOutput, consoleOutputFormJson } from "@app/utils/consoleOutput";
import { parseToIcrcAccountParam } from "@app/utils/parse.utils";
import { Principal } from "@dfinity/principal";
import { BaseHandler, FormResult, IFormError } from "@ic-wallet-kit/common";
import { SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

export declare type Constructable<T> = new (...args: any[]) => T;

export const jsonParamName = "json";

export abstract class BaseActionModel<THandler extends BaseHandler<THandlerForm, TResult>, THandlerForm, TResult, TConsoleForm> implements BaseCommand {

    private jsonParam = `--${jsonParamName}`;
    isJson: boolean = false;

    public abstract parentCommandName: string;
    public abstract commandName: string;
    public abstract description: string;
    protected abstract optionalParamNames: OptionalParamModel[];

    protected abstract formatOutputResult(data: TResult): Promise<void>;

    protected abstract getForm(params: string): Promise<THandlerForm>;

    protected abstract get handlerName(): Constructable<THandler>;

    protected abstract get consoleFormDefaultObject(): TConsoleForm;

    public get fullDescription(): string {

        const params = Object.getOwnPropertyNames(this.consoleFormDefaultObject).map((p) => `<${p}>`);
        const paramString = params.join(" ");

        const optionalParams = this.optionalParamNames.map((p) => `--${p.paramName} <${p.paramName}>`);
        const optionalString = optionalParams.join(" ");

        let description = `.${this.parentCommandName} ${this.commandName} ${paramString} ${optionalString} - ${this.description}`;
        description = description.replace(/ +(?= )/g, '');
        return description;
    }

    public getOptionalParamNames(): OptionalParamModel[] {
        return [...this.optionalParamNames, {
            formName: "",
            paramName: jsonParamName
        }];
    }

    public splitJsonParam(params: string) {
        this.isJson = params.indexOf(this.jsonParam) > -1;
        return params.replace(this.jsonParam, "").trim();
    }

    public async action(params: string): Promise<void> {
        const startTime = performance.now();

        try {
            params = this.splitJsonParam(params);

            const form = await this.getForm(params);

            const handler = Container.get<THandler>(this.handlerName);

            const result = await handler.handle(form);

            await this.consoleOutputResult(result);
        }
        catch (error: any) {
            const validation = error as ConsoleValidationError;

            const errors: IFormError[] = [];

            if (validation && error instanceof ConsoleValidationError) {

                const message = `Param <${validation.fieldName}> ${validation.message}`;

                errors.push({ message: message, fieldName: validation.fieldName, localizationKey: "" });
            }
            else {
                errors.push({ message: error.message, fieldName: "", localizationKey: "" });
            }

            const result = FormResult.error<TResult>(errors);

            await this.consoleOutputResult(result);
        }

        const endTime = performance.now();

        consoleOutput("");
        consoleOutput(`Call to command took ${(endTime - startTime) / 1000} seconds`);
    }

    public async consoleOutputResult(result: FormResult<TResult>) {
        if (this.isJson) {
            consoleOutputFormJson(result);
        }
        else {

            if (result.isSuccess && result.data) {
                await this.formatOutputResult(result.data);
            }
            else {
                consoleOutput("Command failed with follow errors:");
                for (let e of result.errors) {
                    consoleOutput(e.message);
                }

                consoleOutput("Usage:");
                consoleOutput(this.fullDescription);
            }
        }
    }

    protected getConsoleForm(params: string): TConsoleForm {

        const internalForm = this.consoleFormDefaultObject as any;

        const paramList = this.parseParams(params);
        const formList = Object.getOwnPropertyNames(internalForm);

        for (let i in formList) {
            const name = formList[i];
            const type = typeof internalForm[name];
            const value = paramList[i];

            if (!value) {
                throw new ConsoleValidationError(name, `is missing`);
            }

            switch (type) {
                case "string":
                    internalForm[name] = value;
                    break;
                case "object":
                    const subAccountId = internalForm[name] instanceof SubAccountId;

                    if (subAccountId) {

                        const subAccount = SubAccountId.tryParseFromString(value);
                        if (subAccount) {
                            internalForm[name] = subAccount;
                        }
                        else {
                            throw new ConsoleValidationError(name, `has invalid hex format (0x0)`);
                        }
                        break;
                    }

                    const principalInput = internalForm[name] instanceof PrincipalInput;

                    if (principalInput) {

                        const value = paramList[i];

                        const [principalValue, subAccountIdValue] = parseToIcrcAccountParam(value);

                        const principal = (principalValue) ? Principal.fromText(principalValue) : undefined;
                        const subAccount = SubAccountId.tryParseFromString(subAccountIdValue);

                        if (subAccount || principal) {
                            internalForm[name] = new PrincipalInput(principal, subAccount);
                        }
                        else {
                            throw new ConsoleValidationError(name, `has invalid format`);
                        }
                        break;
                    }


                    throw new ConsoleValidationError(name, `has unknown type:${internalForm[name].constructor.name}`);

                default:
                    throw new ConsoleValidationError(name, `has unknown type:${type}`);
            }
        }

        return internalForm as TConsoleForm;
    }

    protected parseOptionalParams(paramsString: string, optionalParamNames: OptionalParamModel[], form: any) {
        let params: OptionalParam[] = [];
        const regex = /--(\w+)\s+"([^"]+)"|--(\w+)\s+'([^']+)'|--(\w+)\s+([^\s]+)/g;

        let match;

        while ((match = regex.exec(paramsString)) !== null) {
            const name = match[1] || match[3] || match[5];
            const value = match[2] || match[4] || match[6];
            params.push({
                name: optionalParamNames.find((p) => p.paramName == name)?.formName || name,
                value: value
            })
        }
        params.forEach((p) => {
            form[p.name] = p.value;
        })
        return params;
    }

    private parseParams(params: string) {

        const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
        const result: string[] = [];
        let match;

        while ((match = regex.exec(params)) !== null) {
            result.push(match[1] || match[2] || match[3]);
        }

        return result;
    }
}