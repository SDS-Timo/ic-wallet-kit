import { SubAccountId } from "@icrc/types";
import { InternalHandlerForm } from "@icrc/types/forms/internalHandlerForm";

export interface GetSubAccountForm extends InternalHandlerForm {
    subAccountId: SubAccountId;
}
