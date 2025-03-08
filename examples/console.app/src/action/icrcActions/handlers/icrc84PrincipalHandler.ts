import { Principal } from "@dfinity/principal";
import { BaseHandler, IFormError } from "@ic-wallet-middleware/common";
import { PrincipalProvider } from "@ic-wallet-middleware/icrc";
import { Service } from "typedi";

export interface Icrc84PrincipalForm {
    owner: string;
    principal: string;
}

export interface Icrc84PrincipalResult {
    accountIdentifier: string;
}

@Service()
export class Icrc84PrincipalHandler extends BaseHandler<Icrc84PrincipalForm, Icrc84PrincipalResult> {
    validate(form: Icrc84PrincipalForm): Promise<void> {
        return Promise.resolve();
    }
    async process(form: Icrc84PrincipalForm): Promise<Icrc84PrincipalResult> {

        const subAccountId = await PrincipalProvider.toSubAccountId(Principal.fromText(form.principal));
        const result = PrincipalProvider.toAccountIdentifier(Principal.fromText(form.owner), subAccountId);

        return {
            accountIdentifier: result
        };
    }
    processError(error: any): IFormError[] {
        return [{
            fieldName: "",
            localizationKey: "icrc84.principal.handler.error",
            message: error.message
        }];
    }

}