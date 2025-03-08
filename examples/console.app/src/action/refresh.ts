/*
import { App } from "@app/main";
import { consoleOutput } from "@app/utils/consoleOutput";
import { RefreshService } from "@hpl-wallet-middleware/service/refreshService";
import Container from "typedi";

export const refresh = async (app: App) => {
    consoleOutput("before set wrong data");
    consoleOutput(app.dataStorage);
    setWrongData(app);
    consoleOutput("after set wrong data");
    consoleOutput(app.dataStorage);
    const refreshService = Container.get(RefreshService);
    await refreshService.runIcrcSync();
    consoleOutput("after refresh");
    consoleOutput(app.dataStorage);

}

const setWrongData = async(app: App) => {
    const assetKey = "wgovh-5cllt-icsap-s5i4s-texol-mdi2u-jbcqb-36ugz-wyaqb-b3avy-qae-ryjl3-tyaaa-aaaaa-aaaba-cai";
    //const value = "{'assetId':'dsaggsdgvsdag','subAccounts':[{'balance':'BIGINT::0','subAccountId':'0x0'},{'balance':'BIGINT::0','subAccountId':'0x1'},{'balance':'BIGINT::0','subAccountId':'0x2'},{'balance':'BIGINT::0','subAccountId':'0x3'},{'balance':'BIGINT::0','subAccountId':'0x4'}],'transactionFee':'BIGINT::10000','metaData':{'decimals':8,'fee':'BIGINT::10000','logo':'','name':'Internet Computer 1111','symbol':'ICP'}}"
    const assedData = "Wrong Data: saghdskughasdnjgb nsdakvlk kdsgsad";
    app.dataStorage.setItem(assetKey, assedData);

    const allowanceKey = "wgovh-5cllt-icsap-s5i4s-texol-mdi2u-jbcqb-36ugz-wyaqb-b3avy-qae-allowances";
    const allowancedData = "Wrong Data";
    app.dataStorage.setItem(allowanceKey, allowancedData);

    const contactAllowanceKey = "wgovh-5cllt-icsap-s5i4s-texol-mdi2u-jbcqb-36ugz-wyaqb-b3avy-qae-contact-allowances";
    app.dataStorage.setItem(contactAllowanceKey, allowancedData);
 }
*/