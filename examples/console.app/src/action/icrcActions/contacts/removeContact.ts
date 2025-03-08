import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { RemoveContactHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

export const removeContact = async (principal: string) => {

    const handler = Container.get(RemoveContactHandler);

    const result = await handler.handle({
        principal: principal,
    });

    consoleOutputFormJson(result);
}