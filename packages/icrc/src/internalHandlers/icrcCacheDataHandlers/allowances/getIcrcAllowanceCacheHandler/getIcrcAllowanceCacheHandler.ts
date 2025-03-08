import { BaseCacheDataHandlerV2, CacheDataError, ILogger, IdentifierService, LoadType } from "@ic-wallet-kit/common";

import { AllowanceLocalCache } from "@icrc/repositories/cache/allowanceLocalCache/allowanceLocalCache";
import { AllowanceCacheInfo } from "@icrc/types/allowances/allowanceCacheInfo";
import { AllowanceCacheModel } from "@icrc/types/allowances/allowanceCacheModel";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

import { Principal } from "@dfinity/principal";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class GetIcrcAllowanceCacheHandler extends BaseCacheDataHandlerV2<
    AllowanceCacheInfo,
    AllowanceCacheModel
> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private allowanceCacheStorage: AllowanceLocalCache
    ) {
        super(logger);
        this.allowanceCacheStorage = allowanceCacheStorage
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: AllowanceCacheInfo): Promise<AllowanceCacheModel | undefined> {
        return this.allowanceCacheStorage.getAllowance(info.spenderPrincipal, info.ledgerAddress, info.subAccountId.toString(), info.spenderSubId.toString());
    }
    async getExternalData(info: AllowanceCacheInfo): Promise<AllowanceCacheModel> {
        const ledgerWrapper = LedgerWrapper.create(this.identifierService.getAgent(), info.ledgerAddress)
        const spenderPrincipal = Principal.fromText(info.spenderPrincipal);
        const ledgerAllowance = await ledgerWrapper.getAllowance(this.identifierService.getPrincipal(), spenderPrincipal, info.subAccountId, info.spenderSubId)
        const result = {
            spenderPrincipal: info.spenderPrincipal,
            spenderSubId: info.spenderSubId.toString(),
            ledgerAddress: info.ledgerAddress,
            subAccountId: info.subAccountId.toString(),
            amount: ledgerAllowance.allowance,
            expiration: ledgerAllowance.expiration
        }
        return result;
    }

    updateField(info: AllowanceCacheInfo, data: AllowanceCacheModel): void {
        let allowance = this.allowanceCacheStorage.getAllowance(info.spenderPrincipal, info.ledgerAddress, info.subAccountId.toString(), info.spenderSubId.toString());
        allowance = data;
        this.allowanceCacheStorage.updateOrAddAllowance(allowance);
    }

    getCacheDataError(info: AllowanceCacheInfo): CacheDataError {
        return new CacheDataError(
            "allowance unavailable",
            "Allowance Unavailable"
        );
    }

    async validate(info: AllowanceCacheInfo): Promise<void> { }


}
