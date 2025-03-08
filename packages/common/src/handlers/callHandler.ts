import { FormResult } from "@common/forms";
import { BaseHandler } from "@common/handlers/baseHandler";
import Container, { Constructable } from "typedi";

export class HandlerWrapper {

    public static async callHandler<TForm,
        TResult,
        T extends BaseHandler<TForm, TResult>>(type: Constructable<T>, form: TForm)
        : Promise<FormResult<TResult>> {

        const handler = Container.get(type);
        const result = await handler.handle(form);
        return result;
    }

}
