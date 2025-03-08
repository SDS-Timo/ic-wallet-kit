import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { RemoveServiceAssetForm, RemoveServiceAssetResult } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class RemoveServiceAssetsHandler extends BaseHandler<RemoveServiceAssetForm, RemoveServiceAssetResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ServiceRepository")
        private serviceRepository: ServiceRepository,
    ) {
        super(logger);
    }

    public validate(form: RemoveServiceAssetForm): Promise<void> {

        if (!form.servicePrincipal) {
            throw new ValidationError("remove.service.servicePrincipal.is.required",
                getPropertyName(form, (v) => v.servicePrincipal),
                "Field servicePrincipal is required");
        }

        if (!form.ledgerAddress) {
            throw new ValidationError("remove.service.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        return Promise.resolve();
    }

    public async process(form: RemoveServiceAssetForm): Promise<RemoveServiceAssetResult> {
        await this.serviceRepository.removeServiceAsset(form.servicePrincipal, form.ledgerAddress);
        return {};
    }
}
