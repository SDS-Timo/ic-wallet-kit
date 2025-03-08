import { SubAccountId } from "@icrc/types";
import { InternalHandlerForm } from "@icrc/types/forms/internalHandlerForm";

export interface LoadAssetForm extends InternalHandlerForm {
    subAccounts: SubAccountId[];
    indexAddress: string;
}
