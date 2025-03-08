import { help } from "@app/action/help";
import { addAllowance } from "@app/action/icrcActions/allowances/addAllowance";
import { checkAllowance } from "@app/action/icrcActions/allowances/checkAllowance";
import { getAllowances } from "@app/action/icrcActions/allowances/getAllowances";
import { removeAllowance } from "@app/action/icrcActions/allowances/removeAllowance";
import { transferFromAllowance } from "@app/action/icrcActions/allowances/transferFromAllowance";
import { updateAllowance } from "@app/action/icrcActions/allowances/updateAllowance";
import { addAssets } from "@app/action/icrcActions/assets/addAssets";
import { addSubAccount } from "@app/action/icrcActions/assets/addSubAccount";
import { getAssetMarkets, getTokenMarkets } from "@app/action/icrcActions/assets/getAssetMarkets";
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
import { transferTokens } from "@app/action/transferTokens";
import { App } from "@app/main";
import { HttpAgent, Identity } from "@dfinity/agent";
import { IdentifierService } from "@ic-wallet-middleware/common";




//import { getHpl } from "@app/action/getHpl";
//import { refresh } from "./action/refresh";
import { getHplAccountList } from "@app/action/hplActions/getHplAccountList";
import { getHplAssetList } from "@app/action/hplActions/getHplAssetList";
import { getHplVirtualAccountList } from "@app/action/hplActions/getHplVirtualAccountList";

import { runDemo } from "@app/action/demoMode/demo";
import { getTransactions } from "@app/action/getTransactions";
import { addHplAccount } from "@app/action/hplActions/addHplAccount";
import { addHplVirtualAccount } from "@app/action/hplActions/addHplVirtualAccount";
import { checkLinkCode } from "@app/action/hplActions/checkLinkCode";
import { addHplContact } from "@app/action/hplActions/contacts/addHplContact";
import { editHplContact } from "@app/action/hplActions/contacts/editHplContact";
import { getHplContactAvailableLinks } from "@app/action/hplActions/contacts/getHplContactAvailableLinks";
import { getHplContactList } from "@app/action/hplActions/contacts/getHplContactList";
import { removeHplContact } from "@app/action/hplActions/contacts/removeHplContact";
import { removeHplContactLink } from "@app/action/hplActions/contacts/removeHplContactLink";
import { deleteHplVirtualAccount } from "@app/action/hplActions/deleteHplVirtualAccount";
import { editHplAccount } from "@app/action/hplActions/editHplAccount";
import { editHplAsset } from "@app/action/hplActions/editHplAsset";
import { editHplVirtualAccount } from "@app/action/hplActions/editHplVirtualAccount";
import { getHplFeeConstant } from "@app/action/hplActions/getHplFeeConstant";
import { resetHplVirtualAccount } from "@app/action/hplActions/resetHplVirtualAccount";
import { transferAccountToAccount } from "@app/action/hplActions/transferAccountToAccount";
import { transferAccountToLink } from "@app/action/hplActions/transferAccountToLink";
import { transferLinkToAccount } from "@app/action/hplActions/transferLinkToAccount";
import { transferLinkToLink } from "@app/action/hplActions/transferLinkToLink";
import { checkAllowanceByPrincipal } from "@app/action/icrcActions/allowances/checkAllowanceByPrincipal";
import { checkAsset } from "@app/action/icrcActions/assets/checkAsset";
import { addService } from "@app/action/icrcActions/services/addService";
import { addServiceAssets } from "@app/action/icrcActions/services/addServiceAssets";
import { checkServicePrincipal } from "@app/action/icrcActions/services/checkServicePrincipal";
import { editServiceName } from "@app/action/icrcActions/services/editServiceName";
import { getServices } from "@app/action/icrcActions/services/getServices";
import { notifyService } from "@app/action/icrcActions/services/notifyService";
import { removeService } from "@app/action/icrcActions/services/removeService";
import { removeServiceAsset } from "@app/action/icrcActions/services/removeServiceAsset";
import { transferFromService } from "@app/action/icrcActions/services/transferFromService";
import { transferToService } from "@app/action/icrcActions/services/transferToService";
import { runWatchOnly } from "@app/action/watchOnly/watchOnly";
import { readValue } from "@app/utils/readValueHelper";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { checkHplDictionary } from "./action/hplActions/checkHplDictionary";
import { checkHplLedger } from "./action/hplActions/checkHplLedger";
import { consoleOutput } from "./utils/consoleOutput";

process.env.CANISTER_ID_DB = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

consoleOutput("hey there!")

let mainApp: App | undefined;



const loginCommand = async (): Promise<boolean> => {

    let seed = "b";
    let input = "hair guilt comic still lesson helmet glare material avocado venue giggle essence".split(" ");
    //let input = "omit choice satisfy million clap jacket month father close balance maze goddess roof habit release bone primary slot clerk about powder affair corn inch".split(" ");
    //let input = await readValue("Enter account memonic phrase: ");

    let phrase: string[] = [];

    for (let word of input) {
        let w = word.trim();

        if (w != "") {
            phrase.push(word);
        }
    }

    try {

        //const phraseToIdentity: (phrase: string[]) => Identity = (phrase) => {
        //    return Secp256k1KeyIdentity.fromSeedPhrase(phrase);
        //};

        //const secpIdentity = phraseToIdentity(phrase);

        const seedToIdentity: (seed: string) => Identity = (seed) => {
            const seedBuf = new Uint8Array(new ArrayBuffer(32));
            seedBuf.set(new TextEncoder().encode(seed));
            return Ed25519KeyIdentity.generate(seedBuf);
        };

        const secpIdentity = seedToIdentity(seed);

        const agent = await HttpAgent.create({
            identity: secpIdentity,
            verifyQuerySignatures: false,
            host: "https://identity.ic0.app",
            retryTimes: 10
        });

        mainApp = new App(new IdentifierService(agent, secpIdentity));

        await mainApp.init();

    }
    catch (e) {

        consoleOutput(e);
    }

    return true;

}

const mainCommands = async (index: number, app: App): Promise<boolean> => {
    const localIndex = index + 1;

    let input = await readValue("Enter command or help: ");

    const command = input[0];

    let result: boolean = true;

    switch (command) {
        case "rwo":
        case "run-watch-only":
            await runWatchOnly();
            break;
        case "demo":
            await runDemo();
            break;
        case "get-avaliable-assets":
            await getAssetMarkets();
            break;
        case "get-token-markets":
            await getTokenMarkets();
            break;
        case "ca":
            await checkAsset("tyyy3-4aaaa-aaaaq-aab7a-cai", "efv5g-kqaaa-aaaaq-aacaa-cai");
            break;
        case "check-asset":
            await checkAsset(input[1], input[2]);
            break;
        case "get-assets":
        case "ga":
            await getAssets();
            break;
        case "add-asset":
            await addAssets(input[1]);
            break;
        case "remove-asset":
            await removeAssets(input[1]);
            break;
        case "add-sub-account":
            await addSubAccount(input[1], input[2], input[3]);
            break;
        case "remove-sub-account":
            await removeSubAccount(input[1], input[2]);
            break;
        case "update-asset":
            await updateAssets(input[1], input[2], Number(input[3]), input[4]);
            break;
        case "transfer-tokens":
            await transferTokens(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "get-contacts":
        case "gc":
            await getContacts();
            break;
        case "add-contact":
            await addContact(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "add-asset-contact":
            await addAssetContact(input[1], input[2]);
            break;
        case "add-sub-account-contact":
            await addSubAccountContact(input[1], input[2], input[3], input[4]);
            break;
        case "edit-contact-name":
            await editContact(input[1], input[2]);
            break;
        case "edit-sub-account-contact":
            await editSubAccountContact(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "remove-contact":
            await removeContact(input[1]);
            break;
        case "remove-asset-contact":
            await removeAssetContact(input[1], input[2]);
            break;
        case "remove-sub-account-contact":
            await removeSubAccountContact(input[1], input[2], input[3]);
            break;
        case "get-transactions":
            await getTransactions(input[1], input[2]);
            break;
        case "gt":
            await getTransactions("ryjl3-tyaaa-aaaaa-aaaba-cai");
            break;
        case "get-allowances":
            await getAllowances(input[1]);
            break;
        case "gal":
            await getAllowances("ryjl3-tyaaa-aaaaa-aaaba-cai");
            break;
        case "add-allowance":
            await addAllowance(input[1], input[2], input[3], input[4], input[5], input[6]);
            break;
        case "aa":
            await addAllowance("ryjl3-tyaaa-aaaaa-aaaba-cai", "0", "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe", "20000", "0",);
            break;
        case "update-allowance":
            await updateAllowance(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "check-allowance":
            await checkAllowance(input[1], input[2], input[3], input[4]);
            break;
        case "check-allowance-by-principal":
            await checkAllowanceByPrincipal(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "remove-allowance":
            await removeAllowance(input[1], input[2], input[3], input[4]);
            break;
        case "ra":
            await removeAllowance("ryjl3-tyaaa-aaaaa-aaaba-cai", "0", "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe", "0");
            break;
        case "transfer-from-allowance":
            await transferFromAllowance(input[1], input[2], input[3], input[4], input[5], input[6]);
            break;
        case "gs":
        case "get-services":
            await getServices();
            break;
        case "add-service":
        case "as":
            await addService(input[1], input[2]);
            break;
        case "check-service-principal":
            await checkServicePrincipal(input[1]);
            break;
        case "add-service-assets":
        case "asa":
            await addServiceAssets(input[1], input[2]);
            break;
        case "edit-service-name":
        case "esn":
            await editServiceName(input[1], input[2]);
            break;
        case "remove-service":
        case "rs":
            await removeService(input[1]);
            break;
        case "remove-service-asset":
        case "rsa":
            await removeServiceAsset(input[1], input[2]);
            break;
        case "transfer-to-service":
        case "tts":
            await transferToService(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "transfer-from-service":
        case "tfs":
            await transferFromService(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "notify-service":
        case "ns":
            await notifyService(input[1], input[2]);
            break;
        // case "refresh":
        // case "r":
        //     await refresh(app);
        //     break;
        // case "gh":
        //     await getHpl();
        //     break;
        case "gha":
        case "get-hpl-assets":
            await getHplAssetList();
            break;
        case "ghac":
        case "get-hpl-accounts":
            await getHplAccountList();
            break;
        case "ghva":
        case "get-hpl-virtual-accounts":
            await getHplVirtualAccountList();
            break;
        case "eha":
            await editHplAsset("1", "Test", "Test");
            break;
        case "edit-hpl-asset":
            await editHplAsset(input[1], input[2], input[3]);
            break;
        case "ahac":
            await addHplAccount("0", "Console Test");
            break;
        case "add-hpl-account":
            await addHplAccount(input[1], input[2]);
            break;
        case "edit-hpl-account":
            await editHplAccount(input[1], input[2]);
            break;
        case "check-hpl-ledger":
            await checkHplLedger(input[1]);
            break;
        case "check-hpl-directory":
            await checkHplDictionary(input[1]);
            break;
        case "ahva":
            await addHplVirtualAccount("0", "0", "Console Test VA", "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "2");
            break;
        case "add-hpl-virtual-account":
            await addHplVirtualAccount(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "ehva":
            await editHplVirtualAccount("6", "0", "Console Test VA", "3");
            break;
        case "edit-hpl-virtual-account":
            await editHplVirtualAccount(input[1], input[2], input[3], input[4]);
            break;
        case "rhva":
            await resetHplVirtualAccount("1");
            break;
        case "reset-hpl-virtual-account":
            await resetHplVirtualAccount(input[1]);
            break;
        case "dhva":
            await deleteHplVirtualAccount("1");
            break;
        case "delete-hpl-virtual-account":
            await deleteHplVirtualAccount(input[1]);
            break;
        case "get-hpl-contacts":
        case "ghc":
            await getHplContactList();
            break;
        case "add-hpl-contact":
            await addHplContact(input[1], input[2], input[3], input[4]);
            break;
        case "ahc":
            await addHplContact("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "Test Contact", "0", "Test Link");
            break;
        case "edit-hpl-contact":
            await editHplContact(input[1], input[2], input[3], input[4]);
            break;
        case "ehc":
            await editHplContact("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "Test Contact 2222", "0", "Test Link 222");
            break;
        case "get-hpl-contact-available-links":
            await getHplContactAvailableLinks(input[1]);
            break;
        case "ghcal":
            await getHplContactAvailableLinks("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe");
            break;
        case "remove-hpl-contact-link":
            await removeHplContactLink(input[1], input[2]);
            break;
        case "rhcl":
            await removeHplContactLink("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe", "0");
            break;
        case "remove-hpl-contact":
            await removeHplContact(input[1]);
            break;
        case "rhc":
            await removeHplContact("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe");
            break;
        case "hpl-transfer-account-to-account":
            await transferAccountToAccount(input[1], input[2], input[3], input[4]);
            break;
        case "htata":
            await transferAccountToAccount("5", "1", "3", "4");
            break;
        case "hpl-transfer-link-to-account":
            await transferLinkToAccount(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "htlta":
            await transferLinkToAccount("6", "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe", "3", "4", "2");
            break;
        case "hpl-transfer-account-to-link":
            await transferAccountToLink(input[1], input[2], input[3], input[4], input[5]);
            break;
        case "hpl-transfer-link-to-link":
            await transferLinkToLink(input[1], input[2], input[3], input[4], input[5], input[6]);
            break;
        case "get-hpl-fee-constant":
            await getHplFeeConstant();
            break;
        case "check-link-code":
        case "clc":
            await checkLinkCode(input[1]);
            break;
        case "help":
            await help();
            break;
        case "logout":
            mainApp = undefined;
            break;
        case "c":
            consoleOutput("Close!");
            result = false;
            process.exit();
            break;
        default:
            consoleOutput("Invalid command!");
            break;
    }

    return result;
}

(async () => {
    // eslint-disable-next-line no-useless-catch
    try {

        let isRun = true;

        while (isRun) {
            if (mainApp) {
                isRun = await mainCommands(0, mainApp);
            }
            else {
                isRun = await loginCommand();
            }

            // consoleOutput(isRun);
        }

    } catch (e) {
        throw e;
    }
})();