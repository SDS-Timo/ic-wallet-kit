import { BaseHandler, ILogger, IdentifierService, LoadType, ValidationError } from "@ic-wallet-kit/common";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { LoadAssetHandler } from "@icrc/internalHandlers/loadAssetHandler/loadAssetHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId, WalletAsset } from "@icrc/types";
import { AccountDefaultEnum } from "@icrc/types/enums";
import { AddAssetForm } from "@icrc/types/forms/assets/addAssetForm";
import { AddAssetResult } from "@icrc/types/forms/assets/addAssetResult";
import { LoadAssetForm } from "@icrc/types/forms/assets/loadAssetForm";
import { IcrcLedgerServiceWrapper } from "@icrc/wrappers";
import { Inject, Service } from "typedi";

@Service()
export class AddAssetHandler extends BaseHandler<AddAssetForm, AddAssetResult> {

    private assetRepository: AssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetRepository")
        assetRepository: AssetRepository,
        private loadAssetHandler: LoadAssetHandler,
        private identifierService: IdentifierService,
        private getTokenSNSCacheHandler: GetTokenSNSCacheHandler
    ) {
        super(logger);
        this.assetRepository = assetRepository;
    }

    public async validate(form: AddAssetForm): Promise<void> {
        const isExists = await this.assetRepository.isAssetExist(form.ledgerAddress);

        if (isExists) {
            throw new ValidationError("adding.asset.already.imported", "", "Asset already Imported");
        }

    }

    public async process(form: AddAssetForm): Promise<AddAssetResult> {

        const idx = await this.assetRepository.getAssetNextIndex();

        const asset: WalletAsset = {
            sortOrder: idx,
            ledgerAddress: form.ledgerAddress,
            indexAddress: form.indexAddress,
            name: form.name,
            tokenName: form.name,
            symbol: form.symbol,
            tokenSymbol: form.symbol,
            shortDecimal: form.shortDecimal,
            logo: undefined,
            supportedStandards: [],
            subAccounts: [
                {
                    subAccountId: "0x0",
                    ledgerAddress: form.ledgerAddress,
                    name: AccountDefaultEnum[AccountDefaultEnum.Default],
                }
            ]
        };

        const info: LoadAssetForm = {
            ledgerAddress: asset.ledgerAddress,
            indexAddress: asset.indexAddress,
            subAccounts: asset.subAccounts.map((sa) => SubAccountId.parseFromString(sa.subAccountId)),
            loadType: LoadType.Quick
        }

        const assetResult = await this.loadAssetHandler.process(info);

        asset.symbol = form.symbol;
        asset.logo = assetResult.logo;
        asset.subAccounts = asset.subAccounts.map((sa) => {
            return {
                name: sa.name,
                ledgerAddress: sa.ledgerAddress,
                subAccountId: sa.subAccountId.toString()
            }
        });

        const params = {
            agent: this.identifierService.getAgent(),
            ledgerAddress: asset.ledgerAddress
        };

        const icrcLedgerServiceWrapper = IcrcLedgerServiceWrapper.create(params, this.logger);
        asset.supportedStandards = await icrcLedgerServiceWrapper.getICRCSupportedStandards();

        if (!asset.logo) {
            const tokens = await this.getTokenSNSCacheHandler.handle({
                loadType: LoadType.Quick
            });

            if (tokens.isSuccess) {
                const token = tokens.data?.TokenList.find(t => t.ledgerAddress == asset.ledgerAddress);

                if (token) {
                    asset.logo = token.logo;
                }
            }
        }

        await this.assetRepository.addAsset(asset);

        return {};
    }


}
