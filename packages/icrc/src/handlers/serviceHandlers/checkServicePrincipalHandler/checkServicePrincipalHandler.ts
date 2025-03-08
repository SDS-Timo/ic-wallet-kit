import { BaseHandler, getPropertyName, IdentifierService, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import { CheckServicePrincipalForm } from "@icrc/types/forms/services/checkServicePrincipalForm";
import { CheckServicePrincipalResult } from "@icrc/types/forms/services/checkServicePrincipalResult";
import { Icrc84ActorWrapper } from "@icrc/wrappers";
import { Inject, Service } from "typedi";

@Service()
export class CheckServicePrincipalHandler extends BaseHandler<CheckServicePrincipalForm, CheckServicePrincipalResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService
    ) {
        super(logger);
    }

    public validate(form: CheckServicePrincipalForm): Promise<void> {
        if (!form.servicePrincipal) {
            throw new ValidationError("check.service.servicePrincipal.is.required",
                getPropertyName(form, (v) => v.servicePrincipal),
                "Field servicePrincipal is required");
        }

        return Promise.resolve();
    }

    public async process(form: CheckServicePrincipalForm): Promise<CheckServicePrincipalResult> {

        let exists = true;

        const agent = await this.identifierService.getAnonymousAgent();

        try {
            const icrc84Wrapper = Icrc84ActorWrapper.create(
                agent,
                form.servicePrincipal
            );
            await icrc84Wrapper.getSupportedAssets();
        }
        catch (e: any) {
            exists = false;
        }

        return {
            isPrincipalExist: exists
        }
    }


}
