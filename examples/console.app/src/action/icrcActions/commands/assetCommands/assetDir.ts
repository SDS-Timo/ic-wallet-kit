import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { assetName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { LoadType } from "@ic-wallet-kit/common";
import { GetAvailableAssetsHandler, GetTokenListForm, GetTokenListResult } from "@ic-wallet-kit/icrc";

export class AssetDirConsoleForm {

    constructor() {
    }
}

export class AssetDir extends BaseActionModel<GetAvailableAssetsHandler, GetTokenListForm, GetTokenListResult, AssetDirConsoleForm> {

    public parentCommandName: string = assetName;
    public commandName: string = "dir";
    public description: string = "all known, pre-configured assets from the internal 'directory'";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected async getForm(params: string): Promise<GetTokenListForm> {
        return { loadType: LoadType.Cache };
    }

    protected get consoleFormDefaultObject(): AssetDirConsoleForm {
        return new AssetDirConsoleForm;
    }

    protected get handlerName(): Constructable<GetAvailableAssetsHandler> {
        return GetAvailableAssetsHandler;
    }

    protected formatOutputResult(data: GetTokenListResult) {
        console.table(data.tokenList, ["name", "symbol", "ledgerAddress", "indexAddress", "decimal"]);
        return Promise.resolve();
    }
}
