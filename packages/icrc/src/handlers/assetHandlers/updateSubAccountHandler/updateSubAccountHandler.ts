import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { UpdateSubAccountForm, UpdateSubAccountResult } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class UpdateSubAccountHandler extends BaseHandler<UpdateSubAccountForm, UpdateSubAccountResult> {

    private assetRepository: AssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetRepository")
        assetRepository: AssetRepository
    ) {
        super(logger);
        this.assetRepository = assetRepository;
    }

    public validate(form: UpdateSubAccountForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("update.asset.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        if (!form.subAccountNewName) {
            throw new ValidationError("update.subAccountNewName.assetName.is.required",
                getPropertyName(form, (v) => v.subAccountNewName),
                "Field subAccountNewName is required");
        }

        return Promise.resolve();
    }

    public async process(form: UpdateSubAccountForm): Promise<UpdateSubAccountResult> {

        await this.assetRepository.updateSubAccount(form);

        return {};
    }


}
