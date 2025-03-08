import { BaseHandler, IdentifierService, ILogger, LoadType } from "@ic-wallet-kit/common";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AssetManagerConfiguration, SubAccountId } from "@icrc/types";
import { AllowanceDataModel } from "@icrc/types/allowances/allowanceDataModel";
import { AddAllowanceResult } from "@icrc/types/forms";
import { convertBigIntToDateString } from "@icrc/utils/dateTimeUtils";
import { LedgerWrapper } from "@icrc/wrappers";
import { Inject, Service } from "typedi";

@Service()
export class AddIcrcAllowanceHandler extends BaseHandler<AllowanceDataModel, AddAllowanceResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private allowanceCacheStorage: AllowanceLocalCache,
        @Inject("AssetManagerConfiguration")
        private configuration: AssetManagerConfiguration,
        private assetMetaDataHandler: AssetMetaDataCacheHandler
    ) {
        super(logger);

    }

    public validate(info: AllowanceDataModel): Promise<void> {
        return Promise.resolve();
    }

    async process(info: AllowanceDataModel): Promise<AddAllowanceResult> {

        await LedgerWrapper.approveAllowance(info, this.identifierService.getAgent());

        const allowance = this.allowanceCacheStorage.addAllowance(info);

        let assetMetaData = await this.assetMetaDataHandler.handle({
            ledgerAddress: info.ledgerAddress,
            loadType: LoadType.Cache
        });

        return {
            amount: allowance.amount,
            ledgerAddress: allowance.ledgerAddress,
            subAccountId: SubAccountId.parseFromString(allowance.subAccountId),
            spenderPrincipal: allowance.spenderPrincipal,
            spenderSubId: SubAccountId.parseFromString(allowance.spenderSubId),
            decimal: assetMetaData.decimals,
            expiration: convertBigIntToDateString(allowance.expiration, this.configuration.defaultDateTimeFormat)
        };
    }
}
