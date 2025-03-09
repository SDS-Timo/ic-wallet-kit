
import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { assetName } from "@app/action/icrcActions/commands/parentName";
import { ConsoleValidationError } from "@app/error/consoleValidationError";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { AddAssetForm, AddAssetHandler, AddAssetResult, GetAvailableAssetsHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

export class AssetAddConsoleForm {

    public ledgerAddress: string = "";

    constructor() {
    }
}

export class AssetAdd extends BaseActionModel<AddAssetHandler, AddAssetForm, AddAssetResult, AssetAddConsoleForm> {


    public parentCommandName: string = assetName;
    public commandName: string = "add";
    public description: string = "adds to list of stored assets";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AssetAddConsoleForm {
        return new AssetAddConsoleForm();
    }

    protected async getForm(params: string): Promise<AddAssetForm> {

        const form = this.getConsoleForm(params);

        let getAvailableAssetsHandler: GetAvailableAssetsHandler = Container.get(GetAvailableAssetsHandler);
        let asset = (await getAvailableAssetsHandler.process({ loadType: LoadType.Cache }))
            .tokenList
            .find((a) => a.ledgerAddress == form.ledgerAddress);

        if (!asset) {
            throw new ConsoleValidationError("ledgerAddress", "Asset not found.");
        }

        return {
            ledgerAddress: asset.ledgerAddress,
            indexAddress: asset.indexAddress,
            name: asset.name,
            symbol: asset.symbol,
            shortDecimal: asset.decimal
        };
    }

    protected get handlerName(): Constructable<AddAssetHandler> {
        return AddAssetHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Asset was added success");
        return Promise.resolve();
    }
}