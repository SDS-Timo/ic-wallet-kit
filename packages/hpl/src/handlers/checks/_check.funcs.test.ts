import { CheckDictionaryPrincipalForm, CheckLedgerPrincipalForm } from "@hpl/forms";
import { checkDictionaryPrincipal, checkLedgerPrincipal } from "@hpl/handlers/checks/check.funcs";
import { CheckDictionaryPrincipalHandler } from "@hpl/handlers/checks/checkDictionaryPrincipalHandler/checkDictionaryPrincipalHandler";
import { CheckLedgerPrincipalHandler } from "@hpl/handlers/checks/checkLedgerPrincipalHandler/checkLedgerPrincipalHandler";
import { FormResult, HandlerWrapper } from "@ic-wallet-middleware/common";

describe("Allowance funcs", () => {

    it("checkDictionaryPrincipal calls handler and returns result", async () => {
        const mockForm: CheckDictionaryPrincipalForm = {
            dictionaryPrincipal: "mock-principal"
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await checkDictionaryPrincipal(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(CheckDictionaryPrincipalHandler, mockForm);
        expect(result).toEqual(mockResult);
    });

    it("checkLedgerPrincipal calls handler and returns result", async () => {
        const mockForm: CheckLedgerPrincipalForm = {
            ledgerPrincipal: "mock-principal"
        };
        const mockResult = FormResult.success({ success: true });

        HandlerWrapper.callHandler = jest.fn().mockResolvedValue(mockResult);

        const result = await checkLedgerPrincipal(mockForm);
        expect(HandlerWrapper.callHandler).toHaveBeenCalledWith(CheckLedgerPrincipalHandler, mockForm);
        expect(result).toEqual(mockResult);
    });
});
