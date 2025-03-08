
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { EditServiceNameHandler } from "@ic-wallet-middleware/icrc";

import Container from "typedi";


export const editServiceName = async (servicePrincipal: string, newName: string) => {

    const handler = Container.get(EditServiceNameHandler)

    const result = await handler.handle({
        servicePrincipal: servicePrincipal,
        newName: newName
    });

    consoleOutputFormJson(result);
}