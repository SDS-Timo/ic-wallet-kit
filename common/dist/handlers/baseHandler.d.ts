import { FormResult } from "@common/forms/formResult";
import { IFormError } from "@common/forms/iFormError";
import { ILogger } from "@common/logger/logger";
import "reflect-metadata";
export declare abstract class BaseHandler<TForm, TResult> {
    abstract validate(form: TForm): Promise<void>;
    abstract process(form: TForm): Promise<TResult>;
    abstract processError(error: any): IFormError[];
    protected logger: ILogger;
    constructor(logger: ILogger);
    handle(form: TForm): Promise<FormResult<TResult>>;
    private processInternalError;
}
