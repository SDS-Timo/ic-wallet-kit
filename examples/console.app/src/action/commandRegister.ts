
import { AllowanceGet } from "@app/action/icrcActions/commands/allowanceCommands/allowanceGet";
import { AllowanceRemove } from "@app/action/icrcActions/commands/allowanceCommands/allowanceRemove";
import { AllowanceSet } from "@app/action/icrcActions/commands/allowanceCommands/allowanceSet";
import { AllowanceList } from "@app/action/icrcActions/commands/allowanceCommands/allowancesList";
import { AllowanceUpdate } from "@app/action/icrcActions/commands/allowanceCommands/allowanceUpdate";
import { AssetAdd } from "@app/action/icrcActions/commands/assetCommands/assetAdd";
import { AssetDir } from "@app/action/icrcActions/commands/assetCommands/assetDir";
import { AssetEdit } from "@app/action/icrcActions/commands/assetCommands/assetEdit";
import { AssetList } from "@app/action/icrcActions/commands/assetCommands/assetList";
import { AssetRemove } from "@app/action/icrcActions/commands/assetCommands/assetRemove";
import { AssetTest } from "@app/action/icrcActions/commands/assetCommands/assetTest";
import { ContactAddAsset } from "@app/action/icrcActions/commands/contactCommands/contactAddAsset";
import { ContactAssetList } from "@app/action/icrcActions/commands/contactCommands/contactAssetList";
import { ContactList } from "@app/action/icrcActions/commands/contactCommands/contactList";
import { ContactName } from "@app/action/icrcActions/commands/contactCommands/contactName";
import { ContactNameSubAccount } from "@app/action/icrcActions/commands/contactCommands/contactNameSubAccount";
import { ContactRemove } from "@app/action/icrcActions/commands/contactCommands/contactRemove";
import { ContactRemoveAsset } from "@app/action/icrcActions/commands/contactCommands/contactRemoveAsset";
import { ContactRemoveSubAccount } from "@app/action/icrcActions/commands/contactCommands/contactRemoveSubAccount";
import { Icrc84Principal } from "@app/action/icrcActions/commands/principalCommands/icrc84Command";
import { Icrc1Principal } from "@app/action/icrcActions/commands/principalCommands/icrcCommand";
import { RefreshIcrcCommand } from "@app/action/icrcActions/commands/refreshCommand";
import { AccountAdd } from "@app/action/icrcActions/commands/subAccountCommands/accountAdd";
import { AccountEdit } from "@app/action/icrcActions/commands/subAccountCommands/accountEdit";
import { AccountList } from "@app/action/icrcActions/commands/subAccountCommands/accountList";
import { AccountRemove } from "@app/action/icrcActions/commands/subAccountCommands/accountRemove";
import { Transfer } from "@app/action/icrcActions/commands/transferCommands/transferCommand";
import { TransferFrom } from "@app/action/icrcActions/commands/transferCommands/transferFromCommand";
import { BaseCommand } from "@app/types/baseCommand";

export const registrationCommand = () => {
    const result: BaseCommand[] = [];

    result.push(new AssetDir());
    result.push(new AssetList());
    result.push(new AssetAdd());
    result.push(new AssetEdit());
    result.push(new AssetRemove());
    result.push(new AssetTest());

    result.push(new AccountList());
    result.push(new AccountAdd());
    result.push(new AccountEdit());
    result.push(new AccountRemove());

    result.push(new ContactList());
    result.push(new ContactAssetList());
    result.push(new ContactName());
    result.push(new ContactAddAsset());
    result.push(new ContactNameSubAccount());
    result.push(new ContactRemove());
    result.push(new ContactRemoveAsset());
    result.push(new ContactRemoveSubAccount());

    result.push(new AllowanceList());
    result.push(new AllowanceGet());
    result.push(new AllowanceSet());
    result.push(new AllowanceUpdate());
    result.push(new AllowanceRemove());

    result.push(new Transfer());
    result.push(new TransferFrom());

    result.push(new RefreshIcrcCommand());

    result.push(new Icrc1Principal());
    result.push(new Icrc84Principal());

    return result;
}