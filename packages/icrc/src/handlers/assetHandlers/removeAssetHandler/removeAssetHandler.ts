import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { AssetLocalCache } from "@icrc/repositories";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { RemoveAssetForm, RemoveAssetResult } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class RemoveAssetHandler extends BaseHandler<RemoveAssetForm, RemoveAssetResult> {

    private assetRepository: AssetRepository;
    private contactRepository: ContactRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetRepository")
        assetRepository: AssetRepository,
        @Inject("ContactRepository")
        contactRepository: ContactRepository,
        private localCacheRepository: AssetLocalCache) {
        super(logger);

        this.assetRepository = assetRepository;
        this.contactRepository = contactRepository;
    }

    public async validate(form: RemoveAssetForm): Promise<void> {
        if (!form.ledgerAddress) {
            throw new ValidationError("remove.asset.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }
    }

    public async process(form: RemoveAssetForm): Promise<RemoveAssetResult> {

        await this.contactRepository.removeAssetFromAllContacts(form.ledgerAddress)
        await this.assetRepository.remove(form.ledgerAddress);
        await this.localCacheRepository.removeAsset(form.ledgerAddress)
        return {};
    }
}
