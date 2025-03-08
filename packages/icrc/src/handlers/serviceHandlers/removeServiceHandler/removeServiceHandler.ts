import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { RemoveServiceForm, RemoveServiceResult } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class RemoveServiceHandler extends BaseHandler<RemoveServiceForm, RemoveServiceResult> {
    private serviceRepository: ServiceRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("ServiceRepository")
        serviceRepository: ServiceRepository,
    ) {
        super(logger);
        this.serviceRepository = serviceRepository;
    }

    public validate(form: RemoveServiceForm): Promise<void> {
        if (!form.servicePrincipal) {
            throw new ValidationError("remove.service.servicePrincipal.is.required",
                getPropertyName(form, (v) => v.servicePrincipal),
                "Field servicePrincipal is required");
        }

        return Promise.resolve();
    }

    public async process(form: RemoveServiceForm): Promise<RemoveServiceResult> {
        await this.serviceRepository.removeService(form.servicePrincipal);
        return {};
    }


}
