import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { CheckDictionaryPrincipalHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";


export const checkHplDictionary = async (dictionaryPrincipal: string) => {

    const editHplAccountHandler = Container.get(CheckDictionaryPrincipalHandler);

    const result = await editHplAccountHandler.handle({
        dictionaryPrincipal: dictionaryPrincipal
    });

    consoleOutputFormJson(result);
};
