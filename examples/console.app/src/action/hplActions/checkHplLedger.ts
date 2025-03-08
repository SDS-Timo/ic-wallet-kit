import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { CheckLedgerPrincipalHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";


export const checkHplLedger = async (ledgerPrincipal: string) => {

    const editHplAccountHandler = Container.get(CheckLedgerPrincipalHandler);

    const result = await editHplAccountHandler.handle({
        ledgerPrincipal: ledgerPrincipal
    });

    consoleOutputFormJson(result);
};
