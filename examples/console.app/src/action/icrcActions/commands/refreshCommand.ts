
import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { IcrcRefreshForm, IcrcRefreshHandler, IcrcRefreshResult } from "@app/action/icrcActions/handlers/icrcRefreshHandler";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";

export class RefreshIcrcCommand extends BaseActionModel<IcrcRefreshHandler, IcrcRefreshForm, IcrcRefreshResult, IcrcRefreshConsoleForm> {

    public parentCommandName: string = "refresh";
    public commandName: string = "icrc";
    public optionalParamNames: OptionalParamModel[] = [];
    public description: string = "refresh icrc data";

    protected getForm(params: string): Promise<IcrcRefreshForm> {
        return Promise.resolve({});
    }

    protected get handlerName(): Constructable<IcrcRefreshHandler> {
        return IcrcRefreshHandler;
    }

    protected get consoleFormDefaultObject(): IcrcRefreshConsoleForm {
        return {};
    }

    protected formatOutputResult(data: IcrcRefreshResult): Promise<void> {
        consoleOutput("Sync was passed success");
        return Promise.resolve();
    }

}

export interface IcrcRefreshConsoleForm {
}
