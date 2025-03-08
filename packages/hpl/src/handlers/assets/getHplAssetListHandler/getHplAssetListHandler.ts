import { GetHplAssetListInfo } from "@hpl/forms/getHplAssetListInfo";
import { GetHplAssetListResult } from "@hpl/forms/getHplAssetListResult";
import { LoadHplAssetHandler } from "@hpl/internalHandlers";
import { HplAssetRepository } from "@hpl/repositories/persists/hplAssetRepository/hplAssetRepository";
import { HplAsset } from "@hpl/types";
import { BaseHandler, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class GetHplAssetListHandler extends BaseHandler<GetHplAssetListInfo, GetHplAssetListResult> {
    private hplAssetRepository: HplAssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private loadHplAssetHandler: LoadHplAssetHandler,
        @Inject("HplAssetRepository")
        hplAssetRepository: HplAssetRepository,
    ) {
        super(logger);
        this.hplAssetRepository = hplAssetRepository;
    }
    async validate(form: GetHplAssetListInfo): Promise<void> {
    }

    async process(form: GetHplAssetListInfo): Promise<GetHplAssetListResult> {
        const cacheData = await this.loadHplAssetHandler.process({
            loadType: LoadType.Full
        });
        const assetsData = await this.hplAssetRepository.getAssets();
        const result: HplAsset[] = [];
        for (let index = 0; index < cacheData.ftAssets.length; index++) {
            const cacheAsset = cacheData.ftAssets[index];
            let findAsset = assetsData.find((a) => a.id === cacheAsset.id.toString())
            if (!findAsset) {
                findAsset = {
                    id: cacheAsset.id.toString(),
                    name: "",
                    symbol: "",
                    assetName: cacheAsset.assetName,
                    assetSymbol: cacheAsset.assetSymbol,
                    logo: cacheAsset.logo
                }
                await this.hplAssetRepository.addAsset(findAsset)
            }
            const asset: HplAsset = { ...cacheData.ftAssets[index], name: findAsset.name, symbol: findAsset.symbol };
            result.push(asset);
        }
        return {
            ftAssets: result
        }
    }



}