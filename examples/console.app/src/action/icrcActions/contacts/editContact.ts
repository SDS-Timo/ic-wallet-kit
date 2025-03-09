import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { EditContactHandler } from "@ic-wallet-kit/icrc";


import Container from "typedi";

export const editContact = async (principal: string, contactName: string) => {

    const handler = Container.get(EditContactHandler);

    const result = await handler.handle({
        principal: principal,
        name: contactName,
    });

    consoleOutputFormJson(result);
}