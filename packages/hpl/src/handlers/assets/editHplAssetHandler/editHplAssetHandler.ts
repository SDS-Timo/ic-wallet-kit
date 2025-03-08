import { EditHplAssetForm } from "@hpl/forms/editHplAssetForm";
import { EditHplAssetResult } from "@hpl/forms/editHplAssetResult";
import { HplAssetRepository } from "@hpl/repositories/persists/hplAssetRepository/hplAssetRepository";
import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class EditHplAssetHandler extends BaseHandler<EditHplAssetForm, EditHplAssetResult> {
    private hplAssetRepository: HplAssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("HplAssetRepository")
        hplAssetRepository: HplAssetRepository,
    ) {
        super(logger);
        this.hplAssetRepository = hplAssetRepository;

    }
    validate(form: EditHplAssetForm): Promise<void> {

        if (form.assetId === undefined) {
            throw new ValidationError("editing.hpl.asset.assetId.is.required",
                getPropertyName(form, f => f.assetId),
                "Field assetId is required");
        }

        return Promise.resolve();
    }

    async process(form: EditHplAssetForm): Promise<EditHplAssetResult> {
        await this.hplAssetRepository.updateAsset(form);
        return {}
    }



}