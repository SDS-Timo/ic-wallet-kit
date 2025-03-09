
import { consoleOutputJson } from "@app/utils/consoleOutput";
import { CheckLinkCodeHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";

export const checkLinkCode = async (linkCode: string) => {
    const checkLinkCodeHandler = Container.get(CheckLinkCodeHandler);
    const result = await checkLinkCodeHandler.handle({
        linkCode: linkCode
    });

    consoleOutputJson(result);
}