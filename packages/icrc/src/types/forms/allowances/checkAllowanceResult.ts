import { AllowanceModel } from "@icrc/types/allowances/allowanceModel";

export interface CheckAllowanceResult {
    existAllowance: boolean;
    allowance: AllowanceModel | undefined;
}
