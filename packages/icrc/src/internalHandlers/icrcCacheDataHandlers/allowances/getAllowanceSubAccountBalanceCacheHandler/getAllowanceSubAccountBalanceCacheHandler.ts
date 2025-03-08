
import { Principal } from "@dfinity/principal";
import { BaseCacheDataHandlerV2, CacheDataError, IInfo, ILogger, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { IcrcCacheBalanceErrorKey, IcrcCacheBalanceErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { AssetLocalCache } from "@icrc/repositories";
import { LocalCacheSubAccountModel, SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import { Inject, Service } from "typedi";

export interface AllowanceSubAccountBalanceInfo extends IInfo {
    principal: string;
    ledgerAddress: string;  // AssetId
    subAccountId: SubAccountId;
}
export interface AllowanceSubAccountBalance {
    subAccountId: SubAccountId;
    balance: bigint;
}

@Service()
export class GetAllowanceSubAccountBalanceCacheHandler extends BaseCacheDataHandlerV2<
    AllowanceSubAccountBalanceInfo,
    AllowanceSubAccountBalance
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private localCacheRepository: AssetLocalCache
    ) {
        super(logger);
    }

    getCacheDataError(info: AllowanceSubAccountBalanceInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheBalanceErrorKey,
            IcrcCacheBalanceErrorMessage
        );
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    async getExternalData(info: AllowanceSubAccountBalanceInfo): Promise<AllowanceSubAccountBalance> {
        const ledgerWrapper = LedgerWrapper.create(
            this.identifierService.getAgent(),
            info.ledgerAddress
        );
        const balance = await ledgerWrapper.getBalance(
            info.subAccountId,
            Principal.fromText(info.principal)
        );
        const result = {
            balance: balance,
            subAccountId: info.subAccountId,
        };
        return result;
    }

    updateField(info: AllowanceSubAccountBalanceInfo, data: AllowanceSubAccountBalance): void {
        const subAccount: LocalCacheSubAccountModel = {
            balance: data.balance,
            subAccountId: info.subAccountId.toString(),
        };
        this.localCacheRepository.setSubAccount(info.ledgerAddress, subAccount);
    }

    getLocalCacheData(
        info: AllowanceSubAccountBalanceInfo
    ): Promise<AllowanceSubAccountBalance | undefined> {
        const subAccountCache = this.localCacheRepository.getSubAccountById(
            info.ledgerAddress,
            info.subAccountId.toString()
        );

        let result: AllowanceSubAccountBalance | undefined = undefined;

        const subAccount = SubAccountId.tryParseFromString(subAccountCache?.subAccountId);

        if (subAccountCache && subAccount) {
            result = {
                balance: subAccountCache.balance,
                subAccountId: subAccount
            };
        }

        return Promise.resolve(result);
    }
}
