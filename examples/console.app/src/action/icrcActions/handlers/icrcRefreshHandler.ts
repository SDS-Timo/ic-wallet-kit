import { BaseHandler, IFormError } from "@ic-wallet-middleware/common";
import { IcrcRefreshService } from "@ic-wallet-middleware/icrc";
import Container, { Service } from "typedi";

export interface IcrcRefreshForm {
}

export interface IcrcRefreshResult {
}

@Service()
export class IcrcRefreshHandler extends BaseHandler<IcrcRefreshForm, IcrcRefreshResult> {
    validate(form: IcrcRefreshForm): Promise<void> {
        return Promise.resolve();
    }
    async process(form: IcrcRefreshForm): Promise<IcrcRefreshResult> {

        const icrcRefreshService = Container.get(IcrcRefreshService);
        await icrcRefreshService.runIcrcSync();

        return {};
    }
    processError(error: any): IFormError[] {
        return [{
            fieldName: "",
            localizationKey: "icrc.refresh.handler.error",
            message: error.message
        }];
    }

}