import { BaseHandler, IdentifierService, ILogger, ValidationError } from "@ic-wallet-kit/common";

import { AllowanceLocalCache } from "@icrc/repositories";
import { AllowanceRepository } from "@icrc/repositories/persists/allowanceRepository/allowanceRepository";
import { AllowanceResult } from "@icrc/types/forms/allowances/allowanceResult";
import { RemoveAllowanceForm } from "@icrc/types/forms/allowances/removeAllowanceForm";
import { LedgerWrapper } from "@icrc/wrappers";

import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class RemoveAllowanceHandler extends BaseHandler<RemoveAllowanceForm, AllowanceResult> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private allowanceCacheStorage: AllowanceLocalCache,
        private allowanceRepository: AllowanceRepository
    ) {
        super(logger);
    }

    public validate(form: RemoveAllowanceForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("removing.allowance.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        if (!form.spenderPrincipal) {
            throw new ValidationError("removing.allowance.spender.is.required",
                "spenderPrincipal",
                "Field spenderPrincipal is required");
        }

        if (!form.subAccountId) {
            throw new ValidationError("removing.allowance.subAccountId.is.required",
                "subAccountId",
                "Field subAccountId is required");
        }

        if (!form.spenderSubId) {
            throw new ValidationError("removing.allowance.spenderSubId.is.required",
                "spenderSubId",
                "Field spenderSubId is required");
        }

        return Promise.resolve();
    }

    public async process(form: RemoveAllowanceForm): Promise<AllowanceResult> {

        await LedgerWrapper.approveAllowance({
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccountId,
            spenderPrincipal: form.spenderPrincipal,
            spenderSubId: form.spenderSubId,
            amount: BigInt(0),
            expiration: undefined
        }, this.identifierService.getAgent());

        this.allowanceCacheStorage.removeAllowance(form.spenderPrincipal,
            form.ledgerAddress,
            form.subAccountId.toString(),
            form.spenderSubId.toString());

        await this.allowanceRepository.removeAllowance(form);
        return {};
    }


}