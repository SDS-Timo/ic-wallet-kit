import { ValidationError } from "@common/errors/validationError";
import { FormResult } from "@common/forms/formResult";
import { IFormError } from "@common/forms/iFormError";
import { ILogger } from "@common/logger/logger";
import { Inject, Service } from "typedi";

@Service()
export abstract class BaseHandler<TForm, TResult> {

    abstract validate(form: TForm): Promise<void>;

    abstract process(form: TForm): Promise<TResult>;

    protected logger: ILogger;
    constructor(
        @Inject("ILogger")
        logger: ILogger) {
        this.logger = logger;
    }

    public async handle(form: TForm): Promise<FormResult<TResult>> {
        try {
            await this.validate(form);

            const data = await this.process(form);

            return FormResult.success(data);
        }
        catch (e: any) {
            this.logger.logError(e);
            return this.processInternalError(e);
        }
    }

    public processError(error: any): IFormError[] {
        return [];
    }

    private processInternalError(error: any): FormResult<TResult> {
        const errors: IFormError[] = this.processError(error);

        if (errors.length > 0) {
            return FormResult.error(errors);
        }

        const validation = error as ValidationError;

        if (validation && validation.localizationKey) {
            errors.push({
                localizationKey: validation.localizationKey,
                fieldName: validation.fieldName,
                message: validation.message
            })
        }
        else {

            if (error instanceof Error) {
                errors.push({
                    message: error.message,
                    fieldName: "",
                    localizationKey: "default.error.message"
                });
            }
            else {
                errors.push({
                    message: JSON.stringify(error) ?? "undefined",
                    fieldName: "",
                    localizationKey: "unexpected.error.message"
                });
            }
        }

        return FormResult.error(errors);
    }
}
