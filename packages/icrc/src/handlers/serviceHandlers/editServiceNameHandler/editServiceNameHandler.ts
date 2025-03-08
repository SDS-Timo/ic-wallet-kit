import { BaseHandler, getPropertyName, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { ServiceRepository } from "@icrc/repositories/persists/serviceRepository/serviceRepository";
import { EditServiceNameForm, EditServiceNameResult } from "@icrc/types/forms";
import { Inject, Service } from "typedi";

@Service()
export class EditServiceNameHandler extends BaseHandler<EditServiceNameForm, EditServiceNameResult> {
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

    public async validate(form: EditServiceNameForm): Promise<void> {
        if (!form.servicePrincipal) {
            throw new ValidationError("edit.service.servicePrincipal.is.required",
                getPropertyName(form, (v) => v.servicePrincipal),
                "Field servicePrincipal is required");
        }

        if (!form.newName) {
            throw new ValidationError("edit.service.newName.is.required",
                getPropertyName(form, (v) => v.newName),
                "Field name is required");
        }

        return Promise.resolve();
    }

    public async process(form: EditServiceNameForm): Promise<EditServiceNameResult> {
        await this.serviceRepository.updateServiceName(form.servicePrincipal, form.newName);
        return {};
    }
}
