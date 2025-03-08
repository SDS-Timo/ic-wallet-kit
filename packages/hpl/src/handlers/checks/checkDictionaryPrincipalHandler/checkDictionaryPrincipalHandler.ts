import { BaseHandler, getPropertyName, IdentifierService, ILogger, ValidationError } from "@ic-wallet-middleware/common";

import { CheckDictionaryPrincipalForm } from "@hpl/forms/checks/checkDictionaryPrincipalForm";
import { CheckDictionaryPrincipalResult } from "@hpl/forms/checks/checkDictionaryPrincipalResult";
import { DictionaryActorWrapper } from "@hpl/hplWrappers";
import { Inject, Service } from "typedi";

@Service()
export class CheckDictionaryPrincipalHandler extends BaseHandler<CheckDictionaryPrincipalForm, CheckDictionaryPrincipalResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService
    ) {
        super(logger);
    }

    validate(form: CheckDictionaryPrincipalForm): Promise<void> {
        if (!form.dictionaryPrincipal) {
            throw new ValidationError("check.dictionary.principal.dictionaryPrincipal.is.required",
                getPropertyName(form, f => f.dictionaryPrincipal),
                "Field dictionaryPrincipal is required");
        }

        return Promise.resolve();
    }

    public async process(form: CheckDictionaryPrincipalForm): Promise<CheckDictionaryPrincipalResult> {

        let exists = true;

        try {
            const dictionaryActorWrapper = DictionaryActorWrapper.create(
                this.identifierService.getAgent(),
                form.dictionaryPrincipal
            );

            await dictionaryActorWrapper.allTokens();
        }
        catch (e: any) {
            exists = false;
        }

        return {
            isPrincipalExist: exists
        }
    }


}
