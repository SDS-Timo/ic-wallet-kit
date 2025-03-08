import { IFormError } from "@common/forms/iFormError";

export class FormResult<TResult> {
    data?: TResult;
    isSuccess: Boolean;
    errors: IFormError[];

    private constructor(_data?: TResult, _errors?: IFormError[]) {
        this.data = _data;
        this.isSuccess = _data != null;
        this.errors = _errors || [];
    }

    public static success<TResult>(_data: TResult): FormResult<TResult> {
        return new FormResult<TResult>(_data);
    }

    public static error<TResult>(_errors: IFormError[]): FormResult<TResult> {
        return new FormResult<TResult>(undefined, _errors);
    }

}
