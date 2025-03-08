import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import { AssetLocalCache } from "@icrc/repositories";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { RemoveSubAccountForm, RemoveSubAccountResult } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class RemoveSubAccountHandler extends BaseHandler<RemoveSubAccountForm, RemoveSubAccountResult> {
    private assetRepository: AssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetRepository")
        assetRepository: AssetRepository,
        private localCacheRepository: AssetLocalCache) {
        super(logger);
        this.assetRepository = assetRepository;
    }

    public async validate(form: RemoveSubAccountForm): Promise<void> {
        if (!form.ledgerAddress) {
            throw new ValidationError("remove.subAccount.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }
    }

    public async process(form: RemoveSubAccountForm): Promise<RemoveSubAccountResult> {

        this.localCacheRepository.removeSubAccount(form.ledgerAddress, form.subAccountId)

        await this.assetRepository.removeSubAccount(form);

        return {};
    }



}
