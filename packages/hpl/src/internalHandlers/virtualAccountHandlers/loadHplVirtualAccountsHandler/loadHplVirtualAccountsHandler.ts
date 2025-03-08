import { HplStateCacheDataInfo } from "@hpl/forms/hplStateCacheDataInfo";
import { LoadHplVirtualAccountForm } from "@hpl/forms/virtualAccounts/loadHplVirtualAccountForm";
import { LoadHplVirtualAccountResult } from "@hpl/forms/virtualAccounts/loadHplVirtualAccountResult";
import { HplMintCacheDataHandler, HplOwnerCacheDataHandler, HplVirtualAccountCacheDataHandler, HplVirtualAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers";
import { HplMintCacheModel } from "@hpl/types/cache/hplMintCacheModel";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types/cache/hplStateVirtualAccountsCacheModel";
import { HplVirtualAccountCacheModel } from "@hpl/types/cache/hplVirtualAccountCacheModel";
import { HplVirtualAccount } from "@hpl/types/virtualAccounts/hplVirtualAccount";
import { getPrincipalGroupsQty } from "@hpl/utils/mintUtils";
import { BaseHandler, getPxlCode, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class LoadHplVirtualAccountsHandler extends BaseHandler<
    LoadHplVirtualAccountForm,
    LoadHplVirtualAccountResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private hplVirtualAccountCacheDataHandler: HplVirtualAccountCacheDataHandler,
        private hplVirtualAccountsStateCacheDataHandler: HplVirtualAccountsStateCacheDataHandler,
        private hplOwnerCacheDataHandler: HplOwnerCacheDataHandler,
        private hplMintCacheDataHandler: HplMintCacheDataHandler
    ) {
        super(logger);
    }

    async validate(form: LoadHplVirtualAccountForm): Promise<void> { }

    async process(form: LoadHplVirtualAccountForm): Promise<LoadHplVirtualAccountResult> {
        const hplAssetInfo = {
            loadType: form.loadType
        };

        const virtualAccountResult = await this.hplVirtualAccountCacheDataHandler.process(hplAssetInfo);
        let mints: HplMintCacheModel[] = [];
        if (virtualAccountResult.virtualAccounts.length > 0) {
            mints = await this.getMintPrincipal(virtualAccountResult.virtualAccounts, form.loadType);
        }

        const ownerCache = await this.hplOwnerCacheDataHandler.process({
            principal: this.identifierService.getPrincipal(),
            loadType: form.loadType
        });

        const hplStateCacheDataInfo: HplStateCacheDataInfo = {
            accountCount: BigInt(0),
            ftAssetCount: BigInt(0),
            virtualAccountCount: virtualAccountResult.virtualAccountLastId,
            remoteAccounts: [],
            loadType: form.loadType
        };

        const stateResult = await this.hplVirtualAccountsStateCacheDataHandler.process(hplStateCacheDataInfo);

        const virtualAccounts: HplVirtualAccount[] = this.getHplVirtualAccounts(stateResult, virtualAccountResult.virtualAccounts, mints, ownerCache.ownerId);

        const result: LoadHplVirtualAccountResult = {
            virtualAccounts: virtualAccounts,
        }
        return result;
    }

    private async getMintPrincipal(
        virtualAccountInfo: Array<HplVirtualAccountCacheModel>,
        loadType: LoadType
    ): Promise<HplMintCacheModel[]> {
        const auxPrincipal: string[] = [];
        virtualAccountInfo.map((vt) => {
            auxPrincipal.push(vt.virtualAccountInfo.principal);
        });
        const checkPrincipal = await Promise.all(
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
        return checkPrincipal.filter((cp) => cp.isMinter)

    }

    private getHplVirtualAccounts(stateData: HplStateVirtualAccountsCacheModel[],
        vtCache: HplVirtualAccountCacheModel[],
        mints: HplMintCacheModel[],
        ownerId: bigint | undefined,
    ): HplVirtualAccount[] {
        const auxFullVirtual: HplVirtualAccount[] = [];

        stateData.map((va) => {
            const vtData = vtCache.find((vt) => vt.virtualAccountId === va.virtualAccountId);
            const vtMint = mints.find((vt) => vt.canisterId === vtData?.virtualAccountInfo.principal);
            const principalCode = ownerId ? ownerId.toString() : ""
            const newCode = getPxlCode(principalCode, va.virtualAccountId);
            auxFullVirtual.push({
                name: "",
                virtualAccountId: va.virtualAccountId,
                amount: va.accountState.ft,
                currencyAmount: "0.00",
                expiration: va.time,
                accessBy: vtData ? vtData.virtualAccountInfo.principal.toString() : "",
                accountId: va.accountId,
                assetId: vtData ? vtData.virtualAccountInfo.accountType.ft : BigInt(0),
                assetSymbol: "",
                code: newCode,
                isMint: vtMint ? vtMint.isMinter : false,
            });
        });
        return auxFullVirtual;
    }


}
