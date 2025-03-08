import { IFormError } from "@common/forms/iFormError";
export declare class FormResult<TResult> {
    data?: TResult;
    isSuccess: Boolean;
    errors: IFormError[];
    private constructor();
    static success<TResult>(_data: TResult): FormResult<TResult>;
    static error<TResult>(_errors: IFormError[]): FormResult<TResult>;
}
