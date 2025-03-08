import { AllowanceContactModel } from "@icrc/types/allowances/allowanceContactModel";
import { SubAccountId } from "@icrc/types/assets";

export interface SubAccountContactView {
    name: string;
    subAccountId: SubAccountId;
    allowance: AllowanceContactModel | undefined;
}
