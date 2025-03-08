import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { assetName } from "@app/action/icrcActions/commands/parentName";
import { ConsoleValidationError } from "@app/error/consoleValidationError";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-middleware/common";
import { GetListAssetHandler, UpdateAssetForm, UpdateAssetHandler, UpdateAssetResult } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

export class AssetEditConsoleForm {

    public ledgerAddress: string = "";

    constructor() {
    }
}

export class AssetEdit extends BaseActionModel<UpdateAssetHandler, UpdateAssetForm, UpdateAssetResult, AssetEditConsoleForm> {

    public parentCommandName: string = assetName;
    public commandName: string = "edit";
    public description: string = "updates exist Asset";
    protected optionalParamNames: OptionalParamModel[] = [
        { formName: "assetName", paramName: "name" },
        { formName: "symbol", paramName: "symbol" },
        { formName: "shortDecimal", paramName: "shortDecimal" }
    ];

    protected get consoleFormDefaultObject(): AssetEditConsoleForm {
        return new AssetEditConsoleForm();
    }

    protected async getForm(params: string): Promise<UpdateAssetForm> {

        let form = this.getConsoleForm(params);

        const getListAssetHandler = Container.get(GetListAssetHandler);
        const assets = await getListAssetHandler.handle({ loadType: LoadType.Cache });
        const asset = assets.data?.assets.find((a) => a.ledgerAddress == form.ledgerAddress);

        if (!asset) {
            throw new ConsoleValidationError("ledgerAddress", "Asset Not Found");
        }

        let result = {
            ledgerAddress: asset.ledgerAddress,
            assetName: asset.name,
            shortDecimal: asset.shortDecimal,
            symbol: asset.symbol
        }

        this.parseOptionalParams(params.trim(), this.optionalParamNames, result);

        return result;
    }

    protected get handlerName(): Constructable<UpdateAssetHandler> {
        return UpdateAssetHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Asset was updated success");
        return Promise.resolve();
    }
}
