import { GetHplFeeConstantInfo, GetHplFeeConstantResult } from "@hpl/forms";
import { HplFeeConstantCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplFeeConstantCacheDataHandler/hplFeeConstantCacheDataHandler";
import { BaseHandler, ILogger } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class GetHplFeeConstantHandler extends BaseHandler<GetHplFeeConstantInfo, GetHplFeeConstantResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private hplFeeConstantCacheDataHandler: HplFeeConstantCacheDataHandler
    ) {
        super(logger);
    }
    async validate(info: GetHplFeeConstantInfo): Promise<void> {
    }

    async process(info: GetHplFeeConstantInfo): Promise<GetHplFeeConstantResult> {

        const feeConstantResult = await this.hplFeeConstantCacheDataHandler.handle({
            loadType: info.loadType
        });

        const result = {
            feeConstant: feeConstantResult.data ? feeConstantResult.data : BigInt(0)
        }

        return result;
    }
}