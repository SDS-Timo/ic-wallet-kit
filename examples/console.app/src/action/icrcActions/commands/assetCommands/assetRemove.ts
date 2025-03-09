
import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { assetName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { RemoveAssetForm, RemoveAssetHandler, RemoveAssetResult } from "@ic-wallet-kit/icrc";

export class AssetRemoveConsoleForm {

    public ledgerAddress: string = "";

    constructor() {
    }
}

export class AssetRemove extends BaseActionModel<RemoveAssetHandler, RemoveAssetForm, RemoveAssetResult, AssetRemoveConsoleForm> {

    public parentCommandName: string = assetName;
    public commandName: string = "remove";
    public description: string = "removes asset from list of stored assets";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AssetRemoveConsoleForm {
        return new AssetRemoveConsoleForm();
    }

    protected getForm(params: string): Promise<RemoveAssetForm> {
        let form = this.getConsoleForm(params);

        return Promise.resolve({ ledgerAddress: form.ledgerAddress });
    }

    protected get handlerName(): Constructable<RemoveAssetHandler> {
        return RemoveAssetHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Asset was removed success");
        return Promise.resolve();
    }
}