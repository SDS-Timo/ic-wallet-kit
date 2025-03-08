import { HplStateCacheDataInfo } from "@hpl/forms/hplStateCacheDataInfo";
import { LoadHplAssetForm } from "@hpl/forms/loadHplAssetForm";
import { LoadHplAssetResult } from "@hpl/forms/loadHplAssetResult";
import { HplAccountCacheDataHandler, HplAdminStateCacheDataHandler, HplDictionaryCacheDataHandler, HplFtAssetCacheDataHandler, HplFtSuppliesStateCacheDataHandler, HplVirtualAccountCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers";
import { HplAssetCache } from "@hpl/types/assets/hplAssetCache";
import { HplDictionaryCacheModel } from "@hpl/types/cache/hplDictionaryCacheModel";
import { HplFtAssetCacheModel } from "@hpl/types/cache/hplFtAssetCacheModel";
import { HplFtSuppliesCacheModel } from "@hpl/types/cache/hplFtSuppliesCacheModel";
import { HplStateAccountsCacheModel } from "@hpl/types/cache/hplStateAccountsCacheModel";
import { BaseHandler, ILogger } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";



@Service()
export class LoadHplAssetHandler extends BaseHandler<
    LoadHplAssetForm,
    LoadHplAssetResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private hplFtAssetCacheDataHandler: HplFtAssetCacheDataHandler,
        private hplAccountCacheDataHandler: HplAccountCacheDataHandler,
        private hplVirtualAccountCacheDataHandler: HplVirtualAccountCacheDataHandler,
        private hplFtSuppliesStateCacheDataHandler: HplFtSuppliesStateCacheDataHandler,
        private hplAdminStateCacheDataHandler: HplAdminStateCacheDataHandler,
        private hplDictionaryCacheDataHandler: HplDictionaryCacheDataHandler,
    ) {
        super(logger);
    }

    async validate(form: LoadHplAssetForm): Promise<void> { }

    async process(form: LoadHplAssetForm): Promise<LoadHplAssetResult> {
        const hplAssetInfo = {
            loadType: form.loadType
        };

        const ftAssetResult = await this.hplFtAssetCacheDataHandler.process(hplAssetInfo);
        const accountResult = await this.hplAccountCacheDataHandler.process(hplAssetInfo);
        const virtualAccountResult = await this.hplVirtualAccountCacheDataHandler.process(hplAssetInfo);

        const hplStateCacheDataInfo: HplStateCacheDataInfo = {
            accountCount: BigInt(0),
            ftAssetCount: ftAssetResult.ftAssetLastId,
            virtualAccountCount: BigInt(0),
            remoteAccounts: [],
            loadType: form.loadType
        };

        const [stateResult, adminStateResult] = await Promise.all([
            this.hplFtSuppliesStateCacheDataHandler.process(hplStateCacheDataInfo),
            this.hplAdminStateCacheDataHandler.process(hplStateCacheDataInfo),
        ]);

        const dictFT = await this.hplDictionaryCacheDataHandler.process({ loadType: form.loadType });

        const ftAssets: HplAssetCache[] = this.getFtsFormate(stateResult,
            ftAssetResult.ftAssets,
            dictFT.assetsDictionary,
            adminStateResult.accounts,
            accountResult.accounts.length,
            virtualAccountResult.virtualAccounts.length
        );
        const result: LoadHplAssetResult = {
            ftAssets: ftAssets,
        }
        return result;
    }

    private getFtsFormate(
        ftSupplies: HplFtSuppliesCacheModel[],
        ftsData: HplFtAssetCacheModel[],
        dictFT: HplDictionaryCacheModel[],
        adminAccountState: HplStateAccountsCacheModel[],
        accountCount: number,
        virtualAccountCount: number
    ) {
        const auxFT: HplAssetCache[] = [];
        ftSupplies.map((asst) => {
            const ftData = ftsData.find((ft) => ft.assetId === asst.assetId);
            const ftDict = dictFT.find((ft) => ft.assetId === asst.assetId);
            const ftAdmin = adminAccountState.find((ft) => ft.accountId === asst.assetId);
            auxFT.push({
                id: asst.assetId,
                assetName: ftDict ? ftDict.name : "",
                assetSymbol: ftDict ? ftDict.symbol : "",
                decimal: ftData ? Number(ftData.ftAssetInfo.decimals) : 0,
                description: ftData ? ftData.ftAssetInfo.description : "",
                logo: ftDict ? ftDict.logo : "",
                controller: ftData ? ftData.ftAssetInfo.controller : "",
                supply: asst.ftSupply,
                ledgerBalance: ftAdmin ? ftAdmin.accountState.ft : BigInt(0),
                accountCount: accountCount,
                virtualAccountCount: virtualAccountCount
            });
        });
        return auxFT;
    };


}
