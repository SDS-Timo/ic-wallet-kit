import { CheckDictionaryPrincipalForm, CheckLedgerPrincipalForm } from "@hpl/forms";
import { CheckDictionaryPrincipalHandler } from "@hpl/handlers/checks/checkDictionaryPrincipalHandler/checkDictionaryPrincipalHandler";
import { CheckLedgerPrincipalHandler } from "@hpl/handlers/checks/checkLedgerPrincipalHandler/checkLedgerPrincipalHandler";
import { HandlerWrapper } from "@ic-wallet-middleware/common";

export const checkDictionaryPrincipal = async (form: CheckDictionaryPrincipalForm) => {
    const result = await HandlerWrapper.callHandler(CheckDictionaryPrincipalHandler, form);
    return result;
}

export const checkLedgerPrincipal = async (form: CheckLedgerPrincipalForm) => {
    const result = await HandlerWrapper.callHandler(CheckLedgerPrincipalHandler, form);
    return result;
}