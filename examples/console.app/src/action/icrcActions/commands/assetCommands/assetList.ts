import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { assetName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { AmountProvider, LoadType } from "@ic-wallet-kit/common";
import { GetAssetListForm, GetAssetListResult, GetListAssetHandler } from "@ic-wallet-kit/icrc";

export class AssetDirConsoleForm {

    constructor() {
    }
}

export class AssetList extends BaseActionModel<GetListAssetHandler, GetAssetListForm, GetAssetListResult, AssetDirConsoleForm> {

    public parentCommandName: string = assetName;
    public commandName: string = "list";
    public description: string = "all assets added by the user, for which at least one subaccount is tracked";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AssetDirConsoleForm {
        return new AssetDirConsoleForm();
    }

    protected async getForm(params: string): Promise<GetAssetListForm> {
        return {
            loadType: LoadType.Quick
        };
    }
    protected get handlerName(): Constructable<GetListAssetHandler> {
        return GetListAssetHandler;
    }

    protected formatOutputResult(data: GetAssetListResult) {

        console.table(data.assets.map((a) => {
            return {
                name: a.name,
                symbol: a.symbol,
                ledgerAddress: a.ledgerAddress,
                balance: AmountProvider.bigIntToDisplay(a.subAccounts.reduce((sum, current) => sum + current.balance, BigInt(0)), a.decimal)
            }

        }), ["name", "symbol", "ledgerAddress", "balance"]);

        return Promise.resolve();
    }
}
