import { BaseHandler, getPropertyName, IdentifierService, ILogger, ValidationError } from "@ic-wallet-kit/common";

import { CheckLedgerPrincipalForm } from "@hpl/forms/checks/checkLedgerPrincipalForm";
import { CheckLedgerPrincipalResult } from "@hpl/forms/checks/checkLedgerPrincipalResult";
import { IngressActorWrapper } from "@hpl/hplWrappers";

import { Inject, Service } from "typedi";

@Service()
export class CheckLedgerPrincipalHandler extends BaseHandler<CheckLedgerPrincipalForm, CheckLedgerPrincipalResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService

    ) {
        super(logger);
    }

    validate(form: CheckLedgerPrincipalForm): Promise<void> {
        if (!form.ledgerPrincipal) {
            throw new ValidationError("check.ledger.principal.ledgerPrincipal.is.required",
                getPropertyName(form, f => f.ledgerPrincipal),
                "Field ledgerPrincipal is required");
        }

        return Promise.resolve();
    }

    public async process(form: CheckLedgerPrincipalForm): Promise<CheckLedgerPrincipalResult> {

        let exists = true;

        try {
            const ingressActorWrapper = IngressActorWrapper.create(
                this.identifierService.getAgent(),
                form.ledgerPrincipal,
                this.logger
            );

            await ingressActorWrapper.getAccounts();
        }
        catch (e: any) {
            exists = false;
        }

        return {
            isPrincipalExist: exists
        }
    }


}
