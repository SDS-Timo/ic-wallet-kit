import { LoadHplAccountForm } from "@hpl/forms/accounts/loadHplAccountForm";
import { LoadHplAccountResult } from "@hpl/forms/accounts/loadHplAccountResult";
import { HplStateCacheDataInfo } from "@hpl/forms/hplStateCacheDataInfo";
import { HplAccountCacheDataHandler, HplAccountsStateCacheDataHandler, HplMintCacheDataHandler, HplOwnerCacheDataHandler, HplVirtualAccountCacheDataHandler, HplVirtualAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers";
import { HplAccount } from "@hpl/types/accounts/hplAccount";
import { HplMintCacheModel } from "@hpl/types/cache/hplMintCacheModel";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types/cache/hplStateVirtualAccountsCacheModel";
import { HplVirtualAccountCacheModel } from "@hpl/types/cache/hplVirtualAccountCacheModel";
import { HplVirtualAccount } from "@hpl/types/virtualAccounts/hplVirtualAccount";
import { getPrincipalGroupsQty } from "@hpl/utils/mintUtils";
import { BaseHandler, getPxlCode, IdentifierService, ILogger, LoadType } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class LoadHplAccountsHandler extends BaseHandler<
    LoadHplAccountForm,
    LoadHplAccountResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private hplAccountCacheDataHandler: HplAccountCacheDataHandler,
        private hplVirtualAccountCacheDataHandler: HplVirtualAccountCacheDataHandler,
        private hplAccountsStateCacheDataHandler: HplAccountsStateCacheDataHandler,
        private hplVirtualAccountsStateCacheDataHandler: HplVirtualAccountsStateCacheDataHandler,
        private hplOwnerCacheDataHandler: HplOwnerCacheDataHandler,
        private hplMintCacheDataHandler: HplMintCacheDataHandler,

    ) {
        super(logger);
    }

    async validate(form: LoadHplAccountForm): Promise<void> { }

    async process(form: LoadHplAccountForm): Promise<LoadHplAccountResult> {
        const hplAssetInfo = {
            loadType: form.loadType
        };

        const [accountResult, virtualAccountResult] = await Promise.all([
            this.hplAccountCacheDataHandler.process(hplAssetInfo),
            this.hplVirtualAccountCacheDataHandler.process(hplAssetInfo),
        ]);

        let mints: HplMintCacheModel[] = [];
        if (virtualAccountResult.virtualAccounts.length > 0) {
            mints = await this.getMintPrinc(virtualAccountResult.virtualAccounts, form.loadType);
        }

        const ownerCache = await this.hplOwnerCacheDataHandler.process({
            principal: this.identifierService.getPrincipal(),
            loadType: form.loadType
        });

        const hplStateCacheDataInfo: HplStateCacheDataInfo = {
            accountCount: accountResult.accountLastId,
            ftAssetCount: BigInt(0),
            virtualAccountCount: virtualAccountResult.virtualAccountLastId,
            remoteAccounts: [],
            loadType: form.loadType
        };

        const virtualAccountsStateResult = await this.hplVirtualAccountsStateCacheDataHandler.process(hplStateCacheDataInfo);
        const accountStateCacheDataHandlerResult = await this.hplAccountsStateCacheDataHandler.process(hplStateCacheDataInfo);

        const virtualAccounts: HplVirtualAccount[] = this.getHplVirtualAccounts(virtualAccountsStateResult, virtualAccountResult.virtualAccounts, mints, ownerCache.ownerId);

        const accounts: HplAccount[] = [];
        accountStateCacheDataHandlerResult.map((sa) => {
            const subData = accountResult.accounts.find((sub) => sub.accountId === sa.accountId);
            const auxVirtuals = virtualAccounts.filter((va) => va.accountId == sa.accountId)
            accounts.push({
                name: "",
                accountId: sa.accountId,
                amount: sa.accountState.ft,
                currencyAmount: "0.00",
                transactionFee: "0",
                ft: subData ? subData.accountType.ft : BigInt(0),
                virtualAccounts: auxVirtuals,
            });
        });



        const result: LoadHplAccountResult = {
            accounts: accounts,
        }
        return result;
    }

    private async getMintPrinc(
        virtualAccountInfo: Array<HplVirtualAccountCacheModel>,
        loadType: LoadType
    ): Promise<HplMintCacheModel[]> {
        const auxPrincipal: string[] = [];
        virtualAccountInfo.map((vt) => {
            auxPrincipal.push(vt.virtualAccountInfo.principal);
        });
        const checkPrinc = await Promise.all(
            auxPrincipal
                .map(async (principal) => {
                    let result = {
                        canisterId: principal,
                        isMinter: false
                    }
                    if (getPrincipalGroupsQty(principal) < 6) {
                        try {
                            result = await this.hplMintCacheDataHandler.process({
                                canisterId: principal,
                                loadType: loadType
                            })

                        } catch (error) {
                            this.logger.logError(error);
                        }
                    }
                    return result;
                }),
        );
        return checkPrinc
            .filter((cp) => cp.isMinter)

    }

    private getHplVirtualAccounts(stateData: HplStateVirtualAccountsCacheModel[],
        vtCache: HplVirtualAccountCacheModel[],
        mints: HplMintCacheModel[],
        ownerId: bigint | undefined,
    ): HplVirtualAccount[] {
        const auxFullVirtuals: HplVirtualAccount[] = [];

        stateData.map((va) => {

            const vtData = vtCache.find((vt) => vt.virtualAccountId === va.virtualAccountId);
            const vtMint = mints.find((vt) => vt.canisterId === vtData?.virtualAccountInfo.principal);
            const prinCode = ownerId ? ownerId.toString() : ""
            const newCode = getPxlCode(prinCode, va.virtualAccountId);
            auxFullVirtuals.push({
                name: "",
                virtualAccountId: va.virtualAccountId,
                amount: va.accountState.ft,
                currencyAmount: "0.00",
                expiration: va.time,
                accessBy: vtData ? vtData.virtualAccountInfo.principal : "",
                accountId: va.accountId,
                assetId: vtData ? vtData.virtualAccountInfo.accountType.ft : BigInt(0),
                assetSymbol: "",
                code: newCode,
                isMint: vtMint ? vtMint.isMinter : false,
            });
        });
        return auxFullVirtuals;
    }

}
