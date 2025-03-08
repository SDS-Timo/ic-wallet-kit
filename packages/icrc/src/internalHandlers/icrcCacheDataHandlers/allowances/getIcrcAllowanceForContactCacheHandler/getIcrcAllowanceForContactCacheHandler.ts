
import { Principal } from "@dfinity/principal";
import { BaseCacheDataHandler, CacheDataError, ILogger, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AllowanceContactCacheInfo } from "@icrc/types/allowances/allowanceContactCacheInfo";
import { AllowanceContactCacheModel } from "@icrc/types/allowances/allowanceContactCacheModel";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class GetIcrcAllowanceForContactCacheHandler extends BaseCacheDataHandler<
    AllowanceContactCacheInfo,
    AllowanceContactCacheModel
> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private allowanceCacheStorage: AllowanceLocalCache
    ) {
        super(logger);
        this.allowanceCacheStorage = allowanceCacheStorage;
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: AllowanceContactCacheInfo): Promise<AllowanceContactCacheModel | undefined> {
        return this.allowanceCacheStorage.getAllowanceForContact(info.senderPrincipal, info.ledgerAddress, info.subAccountId.toString());
    }
    async getExternalData(info: AllowanceContactCacheInfo): Promise<AllowanceContactCacheModel> {
        const ledgerWrapper = LedgerWrapper.create(this.identifierService.getAgent(), info.ledgerAddress)
        const ledgerAllowance = await ledgerWrapper.getAllowance(
            Principal.fromText(info.senderPrincipal),
            this.identifierService.getPrincipal(),
            info.subAccountId)
        const result = {
            senderPrincipal: info.senderPrincipal,
            ledgerAddress: info.ledgerAddress,
            subAccountId: info.subAccountId.toString(),
            amount: ledgerAllowance.allowance,
            expiration: ledgerAllowance.expiration
        }
        return result;
    }

    updateField(info: AllowanceContactCacheInfo, data: AllowanceContactCacheModel): void {
        let allowance = this.allowanceCacheStorage.getAllowanceForContact(info.senderPrincipal, info.ledgerAddress, info.subAccountId.toString());
        allowance = data;
        this.allowanceCacheStorage.updateAllowanceForContact(allowance);
    }

    getCacheDataError(info: AllowanceContactCacheInfo): CacheDataError {
        return new CacheDataError(
            "allowance unavailable",
            "Allowance Unavailable"
        );
    }

    async validate(info: AllowanceContactCacheInfo): Promise<void> { }


}
