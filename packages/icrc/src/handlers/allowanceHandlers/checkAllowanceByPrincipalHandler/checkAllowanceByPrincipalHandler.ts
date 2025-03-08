import { Principal } from "@dfinity/principal";
import { BaseHandler, ILogger, IdentifierService, LoadType, ValidationError } from "@ic-wallet-kit/common";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { CheckAllowanceByPrincipalForm, CheckAllowanceByPrincipalResult } from "@icrc/types/forms";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class CheckAllowanceByPrincipalHandler extends BaseHandler<CheckAllowanceByPrincipalForm, CheckAllowanceByPrincipalResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private assetMetaDataHandler: AssetMetaDataCacheHandler,
    ) {
        super(logger);
    }

    public validate(form: CheckAllowanceByPrincipalForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("check.allowance.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        if (!form.spenderPrincipal) {
            throw new ValidationError("check.allowance.spender.is.required",
                "spenderPrincipal",
                "Field spenderPrincipal is required");
        }

        if (!form.ownerPrincipal) {
            throw new ValidationError("check.allowance.ownerPrincipal.is.required",
                "ownerPrincipal",
                "Field ownerPrincipal is required");
        }

        if (!form.subAccountId) {
            throw new ValidationError("check.allowance.subAccountId.is.required",
                "subAccountId",
                "Field subAccountId is required");
        }

        if (!form.spenderSubId) {
            throw new ValidationError("check.allowance.spenderSubId.is.required",
                "spenderSubId",
                "Field spenderSubId is required");
        }

        return Promise.resolve();
    }

    public async process(form: CheckAllowanceByPrincipalForm): Promise<CheckAllowanceByPrincipalResult> {

        const ledgerWrapper = LedgerWrapper.create(this.identifierService.getAgent(), form.ledgerAddress);
        const ledgerAllowance = await ledgerWrapper.getAllowance(
            Principal.fromText(form.ownerPrincipal),
            Principal.fromText(form.spenderPrincipal),
            form.subAccountId,
            form.spenderSubId
        );

        const result: CheckAllowanceByPrincipalResult = {
            allowance: undefined,
        }

        if (ledgerAllowance.allowance === BigInt(0)) {
            return result;
        }

        let asset = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Cache
        });

        result.allowance = {
            amount: ledgerAllowance.allowance,
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccountId,
            spender: form.spenderPrincipal,
            spenderSubId: form.spenderSubId,
            decimal: asset.decimals,
            expiration: ledgerAllowance.expiration
        }
        return result;
    }


}