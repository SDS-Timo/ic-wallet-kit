import { BaseHandler, ILogger, LoadType, ValidationError } from "@ic-wallet-kit/common";

import { GetIcrcAllowanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceCacheHandler/getIcrcAllowanceCacheHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AllowanceRepository } from "@icrc/repositories/persists/allowanceRepository/allowanceRepository";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";
import { AllowanceCacheInfo } from "@icrc/types/allowances/allowanceCacheInfo";
import { AllowanceCacheModel } from "@icrc/types/allowances/allowanceCacheModel";
import { AllowanceModel } from "@icrc/types/allowances/allowanceModel";
import { AssetManagerConfiguration } from "@icrc/types/configuration/assetManagerConfiguration";
import { GetListAllowanceForm } from "@icrc/types/forms/allowances/getListAllowanceForm";
import { GetListAllowanceResult } from "@icrc/types/forms/allowances/getListAllowanceResult";
import { convertBigIntToDateString } from "@icrc/utils/dateTimeUtils";

import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class GetListAllowanceHandler extends BaseHandler<GetListAllowanceForm, GetListAllowanceResult> {

    private configuration: AssetManagerConfiguration;
    private assetRepository: AssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetManagerConfiguration")
        configuration: AssetManagerConfiguration,
        private allowanceRepository: AllowanceRepository,
        @Inject("AssetRepository")
        assetRepository: AssetRepository,
        private getIcrcAllowanceHandler: GetIcrcAllowanceCacheHandler,
        private assetMetaDataHandler: AssetMetaDataCacheHandler
    ) {
        super(logger);
        this.configuration = configuration;
        this.assetRepository = assetRepository;
    }

    public validate(form: GetListAllowanceForm): Promise<void> {
        if (!form.ledgerAddress) {
            throw new ValidationError("get.allowance.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        return Promise.resolve();
    }

    public async process(form: GetListAllowanceForm): Promise<GetListAllowanceResult> {
        const result: GetListAllowanceResult = {
            allowances: [],
        };
        const asset = await this.assetRepository.getAssetOrDefault(form.ledgerAddress);
        if (!asset) {
            throw new ValidationError("get.asset.allowances.not.found", "ledgerAddress", "Asset Not Found");
        }
        const storageAllowances = await this.allowanceRepository.getAssetAllowances(form.ledgerAddress);

        const handlers: Promise<AllowanceCacheModel>[] = [];
        storageAllowances.forEach((storageAllowance) => {
            const info: AllowanceCacheInfo = {
                spenderPrincipal: storageAllowance.spenderPrincipal,
                spenderSubId: SubAccountId.parseFromString(storageAllowance.spenderSubId),
                ledgerAddress: storageAllowance.ledgerAddress,
                subAccountId: SubAccountId.parseFromString(storageAllowance.subAccountId),
                loadType: form.loadType
            };

            handlers.push(this.getIcrcAllowanceHandler.handle(info));
        });

        // TODO: make sure that if something failed -> handler works well
        const handlersResult = await Promise.all(handlers);

        let assetMetaData = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Cache
        });

        storageAllowances.forEach((item) => {
            const icrcAllowance = handlersResult.find((h) =>
                h.spenderPrincipal == item.spenderPrincipal
                && h.ledgerAddress == item.ledgerAddress
                && h.subAccountId == item.subAccountId
                && h.spenderSubId == item.spenderSubId);
            if (icrcAllowance) {

                const allowance: AllowanceModel =
                {
                    spenderPrincipal: icrcAllowance.spenderPrincipal,
                    spenderSubId: SubAccountId.parseFromString(icrcAllowance.spenderSubId),
                    ledgerAddress: icrcAllowance.ledgerAddress,
                    subAccountId: SubAccountId.parseFromString(icrcAllowance.subAccountId),
                    amount: icrcAllowance.amount,
                    decimal: assetMetaData.decimals,
                    expiration: convertBigIntToDateString(icrcAllowance.expiration, this.configuration.defaultDateTimeFormat)
                }

                result.allowances.push(allowance);
            }
        });

        return result;
    }


}