import { BaseHandler, ILogger, IdentifierService, LoadType, ValidationError } from "@ic-wallet-middleware/common";

import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AllowanceRepository } from "@icrc/repositories/persists/allowanceRepository/allowanceRepository";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { CheckAllowanceForm } from "@icrc/types/forms/allowances/checkAllowanceForm";
import { CheckAllowanceResult } from "@icrc/types/forms/allowances/checkAllowanceResult";
import { SupportedStandardEnum } from "@icrc/types/wallets/supportedStandardEnum";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

import { Principal } from "@dfinity/principal";
import { allowanceCacheToModel, allowanceFormToCache } from "@icrc/maps/allowanceMapper";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AllowanceCacheModel, AssetManagerConfiguration } from "@icrc/types";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class CheckAllowanceHandler extends BaseHandler<CheckAllowanceForm, CheckAllowanceResult> {
    private configuration: AssetManagerConfiguration;
    private assetRepository: AssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetManagerConfiguration")
        configuration: AssetManagerConfiguration,
        private assetMetaDataHandler: AssetMetaDataCacheHandler,
        @Inject("AssetRepository")
        assetRepository: AssetRepository,
        private allowanceRepository: AllowanceRepository,
        private identifierService: IdentifierService,
        private allowanceLocalCache: AllowanceLocalCache
    ) {
        super(logger);
        this.assetRepository = assetRepository;
        this.configuration = configuration;
    }

    public validate(form: CheckAllowanceForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("adding.allowance.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        if (!form.spenderPrincipal) {
            throw new ValidationError("adding.allowance.spender.is.required",
                "spenderPrincipal",
                "Field spender is required");
        }

        if (!form.subAccountId) {
            throw new ValidationError("adding.allowance.subAccountId.is.required",
                "subAccountId",
                "Field subAccountId is required");
        }

        return Promise.resolve();
    }

    public async process(form: CheckAllowanceForm): Promise<CheckAllowanceResult> {
        const isSupportedStandard = await this.assetRepository.checkSupportedStandard(form.ledgerAddress, SupportedStandardEnum.ICRC2)
        if (!isSupportedStandard) {
            throw new ValidationError("asset.not.supported.standard", "", "Asset not supported standard ICRC-2");
        }
        let asset = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        });

        const result: CheckAllowanceResult = {
            allowance: undefined,
            existAllowance: false
        }

        const ledgerWrapper = LedgerWrapper.create(this.identifierService.getAgent(), form.ledgerAddress)
        const ledgerAllowance = await ledgerWrapper.getAllowance(
            this.identifierService.getPrincipal(),
            Principal.fromText(form.spenderPrincipal),
            form.subAccountId,
            form.spenderSubId
        )

        if (ledgerAllowance.allowance > BigInt(0)) {

            const isExist = await this.allowanceRepository.isExistStorageAllowance(form.spenderPrincipal,
                form.ledgerAddress, form.subAccountId.toString(), form.spenderSubId.toString());

            if (!isExist) {
                await this.allowanceRepository.addAllowance(form);
            }

            let cache: AllowanceCacheModel = allowanceFormToCache(form, ledgerAllowance.allowance, ledgerAllowance.expiration);

            this.allowanceLocalCache.updateOrAddAllowance(cache);

            result.allowance = allowanceCacheToModel(cache, asset.decimals, this.configuration.defaultDateTimeFormat);
            result.existAllowance = true;
        }

        return result;
    }


}