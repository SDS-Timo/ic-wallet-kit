import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { subAccountName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { AmountProvider, LoadType } from "@ic-wallet-middleware/common";
import { GetAssetListForm, GetAssetListResult, GetListAssetHandler } from "@ic-wallet-middleware/icrc";

export class AccountListConsoleForm {

    constructor() {
    }
}

export class AccountList extends BaseActionModel<GetListAssetHandler, GetAssetListForm, GetAssetListResult, AccountListConsoleForm> {

    public parentCommandName: string = subAccountName;
    public commandName: string = "list";
    public description: string = "lists all subAccounts of asset or all asset";
    protected optionalParamNames: OptionalParamModel[] = [{ paramName: "asset", formName: "" }];
    public asset: string | undefined;

    protected get consoleFormDefaultObject(): AccountListConsoleForm {
        return new AccountListConsoleForm();
    }

    protected async getForm(params: string): Promise<GetAssetListForm> {
        if (params) {
            const optionalParams = this.parseOptionalParams(params, this.optionalParamNames, {});
            this.asset = optionalParams.find((p) => p.name == "asset")?.value;
        }
        else {
            this.asset = undefined;
        }
        return {
            loadType: LoadType.Quick
        };
    }
    protected get handlerName(): Constructable<GetListAssetHandler> {
        return GetListAssetHandler;
    }

    protected formatOutputResult(result: GetAssetListResult) {
        if (this.asset) {
            this.outputSubaccountByAsset(result);
        }
        else {
            this.outputAllSubaccount(result);
        }

        return Promise.resolve();
    }

    private outputAllSubaccount(result: GetAssetListResult) {
        const subAccounts = result.assets.flatMap((a) => a.subAccounts);
        console.table(subAccounts.map((s) => {
            return {
                asset: result.assets.find((a) => a.ledgerAddress == s.ledgerAddress)?.symbol ?? "",
                name: s.name,
                subAccountId: s.subAccountId.toString(),
                balance: AmountProvider.bigIntToDisplay(s.balance, s.decimal),
                currencyAmount: s.currencyAmount,
            };
        }),
            ["asset", "name", "subAccountId", "balance", "currencyAmount"]);

    }

    private outputSubaccountByAsset(result: GetAssetListResult) {
        const asset = result.assets.find((a) => a.ledgerAddress === this.asset);
        if (asset) {
            console.group(asset.name);
            console.groupEnd();
            console.table(asset.subAccounts.map((s) => {
                return {
                    name: s.name,
                    subAccountId: s.subAccountId.toString(),
                    balance: AmountProvider.bigIntToDisplay(s.balance, s.decimal),
                    currencyAmount: s.currencyAmount,
                };
            }),
                ["name", "subAccountId", "balance", "currencyAmount"]);
        }
    }
}
