import { BaseHandler, ILogger } from "@ic-wallet-kit/common";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { AssetRepository } from "@icrc/repositories";
import { GetTokenListForm } from "@icrc/types/tokens/getTokenListForm";
import { GetTokenListResult } from "@icrc/types/tokens/getTokenListResult";
import { Inject, Service } from "typedi";


@Service()
export class GetAvailableAssetsHandler extends BaseHandler<GetTokenListForm, GetTokenListResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
        private getTokenSNSInternalHandler: GetTokenSNSCacheHandler

    ) {
        super(logger);
    }

    public validate(form: GetTokenListForm): Promise<void> {
        return Promise.resolve();
    }

    public async process(form: GetTokenListForm): Promise<GetTokenListResult> {
        const assets = await this.assetRepository.getTokensOrDefault();
        const tokenResult = await this.getTokenSNSInternalHandler.handle({ loadType: form.loadType });

        const tokens = tokenResult.data?.TokenList ?? [];

        const tokenToAdd = tokens.filter(t => {
            const item = assets.filter(a => a.ledgerAddress == t.ledgerAddress);
            return item.length == 0;
        });

        return {
            tokenList: tokenToAdd
        };
    }
}