import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { UpdateAssetForm, UpdateAssetResult } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class UpdateAssetHandler extends BaseHandler<UpdateAssetForm, UpdateAssetResult> {

    private assetRepository: AssetRepository

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetRepository")
        assetRepository: AssetRepository) {
        super(logger);
        this.assetRepository = assetRepository;
    }

    public async validate(form: UpdateAssetForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("update.asset.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        if (!form.assetName) {
            throw new ValidationError("update.asset.assetName.is.required",
                getPropertyName(form, (v) => v.assetName),
                "Field assetName is required");
        }

        if (!form.symbol) {
            throw new ValidationError("update.asset.symbol.is.required",
                getPropertyName(form, (v) => v.symbol),
                "Field symbol is required");
        }
    }

    public async process(form: UpdateAssetForm): Promise<UpdateAssetResult> {

        await this.assetRepository.updateAsset(form);

        return {};
    }


}
