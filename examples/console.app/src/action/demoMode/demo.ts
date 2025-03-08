import { getTransactions } from "@app/action/getTransactions";
import { addHplAccount } from "@app/action/hplActions/addHplAccount";
import { addHplVirtualAccount } from "@app/action/hplActions/addHplVirtualAccount";
import { deleteHplVirtualAccount } from "@app/action/hplActions/deleteHplVirtualAccount";
import { editHplAsset } from "@app/action/hplActions/editHplAsset";
import { getHplAccountList } from "@app/action/hplActions/getHplAccountList";
import { getHplAssetList } from "@app/action/hplActions/getHplAssetList";
import { getHplVirtualAccountList } from "@app/action/hplActions/getHplVirtualAccountList";
import { resetHplVirtualAccount } from "@app/action/hplActions/resetHplVirtualAccount";
import { addAllowance } from "@app/action/icrcActions/allowances/addAllowance";
import { checkAllowance } from "@app/action/icrcActions/allowances/checkAllowance";
import { getAllowances } from "@app/action/icrcActions/allowances/getAllowances";
import { removeAllowance } from "@app/action/icrcActions/allowances/removeAllowance";
import { updateAllowance } from "@app/action/icrcActions/allowances/updateAllowance";
import { addAssets } from "@app/action/icrcActions/assets/addAssets";
import { addSubAccount } from "@app/action/icrcActions/assets/addSubAccount";
import { checkAsset } from "@app/action/icrcActions/assets/checkAsset";
import { getAssetMarkets } from "@app/action/icrcActions/assets/getAssetMarkets";
import { getAssets } from "@app/action/icrcActions/assets/getAssets";
import { removeAssets } from "@app/action/icrcActions/assets/removeAssets";
import { removeSubAccount } from "@app/action/icrcActions/assets/removeSubAccount";
import { updateAssets } from "@app/action/icrcActions/assets/updateAssets";
import { addAssetContact } from "@app/action/icrcActions/contacts/addAssetsContact";
import { addContact } from "@app/action/icrcActions/contacts/addContact";
import { addSubAccountContact } from "@app/action/icrcActions/contacts/addSubAccountContact";
import { editContact } from "@app/action/icrcActions/contacts/editContact";
import { editSubAccountContact } from "@app/action/icrcActions/contacts/editSubAccountContact";
import { getContacts } from "@app/action/icrcActions/contacts/getContacts";
import { removeAssetContact } from "@app/action/icrcActions/contacts/removeAssetContact";
import { removeContact } from "@app/action/icrcActions/contacts/removeContact";
import { removeSubAccountContact } from "@app/action/icrcActions/contacts/removeSubAccountContact";
import { addService } from "@app/action/icrcActions/services/addService";
import { addServiceAssets } from "@app/action/icrcActions/services/addServiceAssets";
import { editServiceName } from "@app/action/icrcActions/services/editServiceName";
import { getServices } from "@app/action/icrcActions/services/getServices";
import { removeService } from "@app/action/icrcActions/services/removeService";
import { removeServiceAsset } from "@app/action/icrcActions/services/removeServiceAsset";
import { transferToService } from "@app/action/icrcActions/services/transferToService";
import { consoleOutput } from "@app/utils/consoleOutput";
import { readValue } from "@app/utils/readValueHelper";

const isPauseNeed = false;

export const runDemo = async () => {

    consoleOutput("Demo beginning:");
    await runIcrcAssetDemo();
    await runIcrcContactDemo();
    await runIcrcAllowanceDemo();


    /*
      await runIcrcAssetDemo();

      //  await readValue("Press enter to continue");

      await runIcrcContactDemo();

          // await readValue("Press enter to continue");

          await runIcrcAllowanceDemo();

          //  await readValue("Press enter to continue");

 await runIcrcServiceDemo();
          //  await readValue("Press enter to continue");

          await runIcrcServiceTransferDemo();

          //  await readValue("Press enter to continue");

          await runHplAccountDemo();
      */
    consoleOutput("Demo completed");
}

export const runIcrcAssetDemo = async () => {

    await runCommand("Get Available Token Markets", getAssetMarkets());

    await runCommand("Add Gold Governance Token", addAssets("tyyy3-4aaaa-aaaaq-aab7a-cai"));

    await runCommand("Add subAccount to asset", addSubAccount("tyyy3-4aaaa-aaaaq-aab7a-cai", "0x3", "Name xxxx"));

    await runCommand("Get Asset List", getAssets());

    await runCommand("Remove subAccount from asset", removeSubAccount("tyyy3-4aaaa-aaaaq-aab7a-cai", "0x3"));

    await runCommand("Get Asset List", getAssets());

    await runCommand("Update asset", updateAssets("tyyy3-4aaaa-aaaaq-aab7a-cai", "New Gold Governance Token", 8, "New Token symbol"));

    await runCommand("Get Asset List", getAssets());

    await runCommand("Remove Asset", removeAssets("tyyy3-4aaaa-aaaaq-aab7a-cai"));

    await runCommand("Get Asset List", getAssets());

    await runCommand("Get Transactions of ICP", getTransactions("ryjl3-tyaaa-aaaaa-aaaba-cai"));

    await runCommand("Check Gold Governance Token", checkAsset("tyyy3-4aaaa-aaaaq-aab7a-cai", "efv5g-kqaaa-aaaaq-aacaa-cai"));


}

export const runIcrcContactDemo = async () => {

    await runCommand("Add Contact",
        addContact("wmvwj-77su2-en7sh-o3jow-jenq2-b6mc5-3l3ul-q3crt-v33oq-azs2l-wae", "test_contact", "ryjl3-tyaaa-aaaaa-aaaba-cai", "0x2", "xxx"));

    await runCommand("Add Asset Contact",
        addAssetContact("wmvwj-77su2-en7sh-o3jow-jenq2-b6mc5-3l3ul-q3crt-v33oq-azs2l-wae", "mxzaz-hqaaa-aaaar-qaada-cai"));

    await runCommand("Add Sub Account Contact",
        addSubAccountContact("wmvwj-77su2-en7sh-o3jow-jenq2-b6mc5-3l3ul-q3crt-v33oq-azs2l-wae", "mxzaz-hqaaa-aaaar-qaada-cai", "0x5", "Sub Account Contact Name"));

    await runCommand("Get Contact", getContacts());

    await runCommand("Edit Contact",
        editContact("wmvwj-77su2-en7sh-o3jow-jenq2-b6mc5-3l3ul-q3crt-v33oq-azs2l-wae", "Test Contact Name"));

    await runCommand("Edit SubAccount Contact",
        editSubAccountContact("wmvwj-77su2-en7sh-o3jow-jenq2-b6mc5-3l3ul-q3crt-v33oq-azs2l-wae", "mxzaz-hqaaa-aaaar-qaada-cai", "0x5", "test", "0x5"));

    await runCommand("Get Contact", getContacts());

    await runCommand("Remove SubAccount Contact",
        removeSubAccountContact("wmvwj-77su2-en7sh-o3jow-jenq2-b6mc5-3l3ul-q3crt-v33oq-azs2l-wae", "mxzaz-hqaaa-aaaar-qaada-cai", "0x1"));

    await runCommand("Remove Asset from Contact",
        removeAssetContact("wmvwj-77su2-en7sh-o3jow-jenq2-b6mc5-3l3ul-q3crt-v33oq-azs2l-wae", "mxzaz-hqaaa-aaaar-qaada-cai",));
    await runCommand("Remove Contact",
        removeContact("wmvwj-77su2-en7sh-o3jow-jenq2-b6mc5-3l3ul-q3crt-v33oq-azs2l-wae"));

    await runCommand("Get Contact", getContacts());


}

export const runIcrcAllowanceDemo = async () => {

    await runCommand("Get Allowances of ICP", getAllowances("ryjl3-tyaaa-aaaaa-aaaba-cai"));

    await runCommand("Add Allowance of ICP", addAllowance("ryjl3-tyaaa-aaaaa-aaaba-cai", "0x0", "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "10000", "0x0"));

    await runCommand("Get Allowances of ICP", getAllowances("ryjl3-tyaaa-aaaaa-aaaba-cai"));

    await runCommand("update Allowance of ICP", updateAllowance("ryjl3-tyaaa-aaaaa-aaaba-cai", "0x0", "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "10000", "0x0"));

    await runCommand("Get Allowances of ICP", getAllowances("ryjl3-tyaaa-aaaaa-aaaba-cai"));

    await runCommand("Check Allowance of ICP", checkAllowance("ryjl3-tyaaa-aaaaa-aaaba-cai", "0x0", "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "0x0"));

    await runCommand("Remove Allowance of ICP", removeAllowance("ryjl3-tyaaa-aaaaa-aaaba-cai", "0x0", "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "0x0"));

    await runCommand("Get Allowances of ICP", getAllowances("ryjl3-tyaaa-aaaaa-aaaba-cai"));

    /*
    transfer-from-allowance ryjl3-tyaaa-aaaaa-aaaba-cai 0 gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe wgovh-5cllt-icsap-s5i4s-texol-mdi2u-jbcqb-36ugz-wyaqb-b3avy-qae 0 0.0001 0.0001
    */
}

export const runIcrcServiceDemo = async () => {

    await runCommand("Get services of ICP", getServices());

    await runCommand("Add service of ICP", addService("pmr6h-yaaaa-aaaao-a3myq-cai", "TestService"));

    await runCommand("Add service assets of ICP", addServiceAssets("pmr6h-yaaaa-aaaao-a3myq-cai", "ryjl3-tyaaa-aaaaa-aaaba-cai"));

    await runCommand("Get services of ICP", getServices());

    await runCommand("Edit service name of ICP", editServiceName("pmr6h-yaaaa-aaaao-a3myq-cai", "New service name"));

    await runCommand("Get services of ICP", getServices());

    await runCommand("Remove service assets of ICP", removeServiceAsset("pmr6h-yaaaa-aaaao-a3myq-cai", "ryjl3-tyaaa-aaaaa-aaaba-cai"));

    await runCommand("Remove service of ICP", removeService("pmr6h-yaaaa-aaaao-a3myq-cai"));

    await runCommand("Get services of ICP", getServices());
}

export const runIcrcServiceTransferDemo = async () => {

    await runCommand("Transfer to service of ICP",
        transferToService("ryjl3-tyaaa-aaaaa-aaaba-cai", "0", "pmr6h-yaaaa-aaaao-a3myq-cai", "wgovh-5cllt-icsap-s5i4s-texol-mdi2u-jbcqb-36ugz-wyaqb-b3avy-qae", "0.0002"));

    // await runCommand("Notify service of ICP", notifyService("pmr6h-yaaaa-aaaao-a3myq-cai", "ryjl3-tyaaa-aaaaa-aaaba-cai"));

    //  await runCommand("Transfer to service of ICP",
    //      transferFromService("pmr6h-yaaaa-aaaao-a3myq-cai", "ryjl3-tyaaa-aaaaa-aaaba-cai", "0", "0.0002"));
}

export const runHplDemo = async () => {

    await runCommand("Get asset list of HPL", getHplAssetList());

    await runCommand("Edit asset of HPL", editHplAsset("1", "Test", "Test"));

    await runCommand("Get asset list of HPL", getHplAssetList());

    await runCommand("Get account list of HPL", getHplAccountList());

    await runCommand("Add account list of HPL", addHplAccount("0", "Console Test"));

    await runCommand("Get account list of HPL", getHplAccountList());
}

export const runHplAccountDemo = async () => {

    await runCommand("Get virtual account list of HPL", getHplVirtualAccountList());

    const id = await runCommand("Add virtual account list of HPL",
        addHplVirtualAccount("0", "0", "Console Test VA", "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "2"));

    await runCommand("Get virtual account list of HPL", getHplVirtualAccountList());

    // await runCommand("Edit virtual account list of HPL",
    //     editHplVirtualAccount("1", "0", "Console Test VA", "2"));

    await runCommand("Get virtual account list of HPL", getHplVirtualAccountList());

    await runCommand("Reset virtual account list of HPL", resetHplVirtualAccount(id));

    await runCommand("Delete virtual account list of HPL", deleteHplVirtualAccount(id));

    await runCommand("Get virtual account list of HPL", getHplVirtualAccountList());

}

export const runCommand = async (message: string, command: Promise<any>): Promise<any> => {

    consoleOutput(" -- " + message + " --");

    const result = await command;

    consoleOutput(" -- Completed " + message + " --");

    if (isPauseNeed) {
        await readValue("Press enter to continue");
    }

    return result;
}