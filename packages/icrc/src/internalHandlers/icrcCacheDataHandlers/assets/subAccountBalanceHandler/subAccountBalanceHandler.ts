
import { BaseCacheDataHandlerV2, CacheDataError, IInfo, ILogger, IdentifierService, LoadType } from "@ic-wallet-kit/common";
import { IcrcCacheBalanceErrorKey, IcrcCacheBalanceErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { AssetLocalCache } from "@icrc/repositories";
import { LocalCacheSubAccountModel, SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import { Inject, Service } from "typedi";

export interface SubAccountBalanceInfo extends IInfo {
    ledgerAddress: string;  // AssetId
    subAccountId: SubAccountId;
}
export interface SubAccountBalance {
    subAccountId: SubAccountId;
    balance: bigint;
}

@Service()
export class SubAccountBalanceHandler extends BaseCacheDataHandlerV2<SubAccountBalanceInfo, SubAccountBalance> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private localCacheRepository: AssetLocalCache
    ) {
        super(logger);
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    getCacheDataError(info: SubAccountBalanceInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheBalanceErrorKey,
            IcrcCacheBalanceErrorMessage
        );
    }

    async getExternalData(info: SubAccountBalanceInfo): Promise<SubAccountBalance> {
        const ledgerWrapper = LedgerWrapper.create(
            this.identifierService.getAgent(),
            info.ledgerAddress
        );
        const balance = await ledgerWrapper.getBalance(
            info.subAccountId,
            this.identifierService.getPrincipal()
        );
        const result = {
            balance: balance,
            subAccountId: info.subAccountId,
        };
        return result;
    }

    updateField(info: SubAccountBalanceInfo, data: SubAccountBalance): void {
        const subAccount: LocalCacheSubAccountModel = {
            balance: data.balance,
            subAccountId: info.subAccountId.toString(),
        };
        this.localCacheRepository.setSubAccount(info.ledgerAddress, subAccount);
    }

    getLocalCacheData(
        info: SubAccountBalanceInfo
    ): Promise<SubAccountBalance | undefined> {
        const subAccount = this.localCacheRepository.getSubAccountById(
            info.ledgerAddress,
            info.subAccountId.toString()
        );

        let result: SubAccountBalance | undefined = undefined;
        if (subAccount) {
            result = {
                balance: subAccount.balance,
                subAccountId: info.subAccountId,
            };
        }

        return Promise.resolve(result);
    }
}
