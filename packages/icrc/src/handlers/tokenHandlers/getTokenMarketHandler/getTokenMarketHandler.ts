import { BaseHandler, ILogger } from "@ic-wallet-middleware/common";
import { GetTokenMarketCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/getTokenMarketCacheHandler/getTokenMarketCacheHandler";
import { GetTokenListForm } from "@icrc/types/tokens/getTokenListForm";
import { GetTokenMarketInfo } from "@icrc/types/tokens/getTokenMarketInfo";
import { GetTokenMarketResult } from "@icrc/types/tokens/getTokenMarketResult";
import { Inject, Service } from "typedi";

@Service()
export class GetTokenMarketHandler extends BaseHandler<GetTokenMarketInfo, GetTokenMarketResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private getTokenMarketCacheHandler: GetTokenMarketCacheHandler
    ) {
        super(logger);

    }

    public validate(form: GetTokenListForm): Promise<void> {
        return Promise.resolve();
    }

    public async process(form: GetTokenMarketInfo): Promise<GetTokenMarketResult> {

        const result = await this.getTokenMarketCacheHandler.process({ loadType: form.loadType });

        return {
            markets: result.markets
        };
    }

}