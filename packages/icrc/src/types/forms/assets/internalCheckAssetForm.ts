import { InternalHandlerForm } from "@icrc/types/forms/internalHandlerForm";

export interface InternalCheckAssetForm extends InternalHandlerForm {
    subAccounts: string[];
}
