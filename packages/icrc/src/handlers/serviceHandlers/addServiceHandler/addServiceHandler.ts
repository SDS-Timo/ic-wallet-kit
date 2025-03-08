import { BaseHandler, getPropertyName, IdentifierService, ILogger, LoadType, ValidationError } from "@ic-wallet-kit/common";
import { SupportedAssetsCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/supportedAssetsCacheHandler/supportedAssetsCacheHandler";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { buildAvailableAssetView } from "@icrc/maps/serviceMapper";
import { AssetRepository } from "@icrc/repositories";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { AddServiceForm } from "@icrc/types/forms";
import { ServiceModel, ServiceView } from "@icrc/types/services";
import { Icrc84ActorWrapper } from "@icrc/wrappers";
import { Inject, Service } from "typedi";

@Service()
export class AddServiceHandler extends BaseHandler<AddServiceForm, ServiceView> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("ServiceRepository")
        private serviceRepository: ServiceRepository,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository,
        private getTokenSNSInternalHandler: GetTokenSNSCacheHandler,
        private supportedAssetsHandler: SupportedAssetsCacheHandler,
    ) {
        super(logger);
    }

    public async validate(form: AddServiceForm): Promise<void> {

        if (!form.newName) {
            throw new ValidationError("add.service.name.is.required",
                getPropertyName(form, (v) => v.newName),
                "Field name is required");
        }

        const isExist = await this.serviceRepository.isServiceExist(form.servicePrincipal)
        if (isExist) {
            throw new ValidationError("add.service.already.exist",
                getPropertyName(form, (v) => v.servicePrincipal),
                "Service already exist");
        }

        try {
            const icrc84Wrapper = Icrc84ActorWrapper.create(
                this.identifierService.getAgent(),
                form.servicePrincipal
            );
            await icrc84Wrapper.getSupportedAssets();
        }
        catch (e: any) {
            throw new ValidationError(
                "add.service.invalid",
                "servicePrincipal",
                "Service interface not recognized"
            );
        }
    }

    public async process(form: AddServiceForm): Promise<ServiceView> {
        const service: ServiceModel = {
            principal: form.servicePrincipal,
            name: form.newName,
            assets: []
        }
        await this.serviceRepository.addService(service);

        const assets = await this.assetRepository.getTokensOrDefault();
        const tokenResult = await this.getTokenSNSInternalHandler.handle({ loadType: LoadType.Quick });
        const tokens = tokenResult.data?.TokenList ?? [];
        const supportAssetsResult = await this.supportedAssetsHandler.handle({ servicePrincipal: service.principal, loadType: LoadType.Cache });
        const supportAssets = supportAssetsResult.data?.principals ?? [];

        const availableAssets = buildAvailableAssetView(assets, tokens, supportAssets);

        return {
            serviceAssets: [],
            availableAssets: availableAssets,
            serviceName: service.name,
            servicePrincipal: service.principal,
            isSync: true
        };
    }
}
