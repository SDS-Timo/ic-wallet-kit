import { BaseHandler, getPropertyName, ILogger, LoadType, ValidationError } from "@ic-wallet-middleware/common";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { AddSubAccountForm, AddSubAccountResult, GetSubAccountForm } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class AddSubAccountHandler extends BaseHandler<AddSubAccountForm, AddSubAccountResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
        private getSubAccountByHandler: GetSubAccountByHandler
    ) {
        super(logger);
        this.assetRepository = assetRepository;
    }

    public validate(form: AddSubAccountForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("add.subaccount.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        if (!form.subAccountName) {
            throw new ValidationError("add.subaccount.subAccountName.is.required",
                getPropertyName(form, (v) => v.subAccountName),
                "Field subAccountName is required");
        }

        return Promise.resolve();
    }

    public async process(form: AddSubAccountForm): Promise<AddSubAccountResult> {

        const asset = await this.assetRepository.getAssetOrDefault(form.ledgerAddress);

        if (!asset) {
            throw new ValidationError("asset.not.found", "ledgerAddress", "Asset Not Found");
        }

        let subAccount = asset.subAccounts.find(s => s.subAccountId == form.subAccountId.toString());

        if (subAccount) {
            throw new ValidationError("sub.account.already.exists", "subAccountId", "Sub-account already exists");
        }

        const info: GetSubAccountForm = {
            ledgerAddress: asset.ledgerAddress,
            subAccountId: form.subAccountId,
            loadType: LoadType.Quick
        }

        const subAccountResult = await this.getSubAccountByHandler.process(info);

        subAccount = {
            ledgerAddress: subAccountResult.ledgerAddress,
            name: form.subAccountName,
            subAccountId: subAccountResult.subAccountId.toString()
        }

        await this.assetRepository.addSubAccount(subAccount);

        return {};
    }


}
