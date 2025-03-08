import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { assetName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { CheckAssetForm, CheckAssetHandler, ManualAssetView } from "@ic-wallet-middleware/icrc";

export class AssetTestConsoleForm {

    public ledgerAddress: string = "";
    public indexAddress: string = "";

    constructor() {
    }
}

export class AssetTest extends BaseActionModel<CheckAssetHandler, CheckAssetForm, ManualAssetView, AssetTestConsoleForm> {

    public parentCommandName: string = assetName;
    public commandName: string = "test";
    public description: string = "checks if the asset exists";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AssetTestConsoleForm {
        return new AssetTestConsoleForm;
    }

    protected getForm(params: string): Promise<CheckAssetForm> {

        const form = this.getConsoleForm(params);

        return Promise.resolve({
            ledgerAddress: form.ledgerAddress,
            indexAddress: form.indexAddress
        });
    }

    protected get handlerName(): Constructable<CheckAssetHandler> {
        return CheckAssetHandler;
    }

    protected formatOutputResult(data: ManualAssetView) {
        const output = [
            {
                canister: "Ledger",
                canisterId: data.ledgerAddress,
                exists: data.contractResult.isSuccess
            },
            {
                canister: "Index",
                canisterId: data.indexAddress,
                exists: data.indexResult.isSuccess
            }
        ]

        console.table(output);

        return Promise.resolve();
    }
}
