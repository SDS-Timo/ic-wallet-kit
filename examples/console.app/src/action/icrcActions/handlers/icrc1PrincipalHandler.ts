import { Principal } from "@dfinity/principal";
import { BaseHandler, IFormError } from "@ic-wallet-kit/common";
import { PrincipalProvider, SubAccountId } from "@ic-wallet-kit/icrc";
import { Service } from "typedi";

export interface Icrc1PrincipalForm {
    principal: string;
    subAccount: SubAccountId;
}

export interface Icrc1PrincipalResult {
    accountIdentifier: string;
}

@Service()
export class Icrc1PrincipalHandler extends BaseHandler<Icrc1PrincipalForm, Icrc1PrincipalResult> {
    validate(form: Icrc1PrincipalForm): Promise<void> {
        return Promise.resolve();
    }
    process(form: Icrc1PrincipalForm): Promise<Icrc1PrincipalResult> {

        const result = PrincipalProvider.toAccountIdentifier(Principal.fromText(form.principal), form.subAccount);

        return Promise.resolve({
            accountIdentifier: result
        });
    }
    processError(error: any): IFormError[] {
        return [{
            fieldName: "",
            localizationKey: "icrc1.principal.handler.error",
            message: error.message
        }];
    }

}