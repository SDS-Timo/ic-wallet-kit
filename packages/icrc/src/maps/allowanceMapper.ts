import { AllowanceCacheModel, AllowanceModel, SubAccountId } from "@icrc/types";
import { AllowanceDataModel } from "@icrc/types/allowances/allowanceDataModel";
import { CheckAllowanceForm } from "@icrc/types/forms";
import { convertBigIntToDateString } from "@icrc/utils/dateTimeUtils";

export function allowanceCacheToModel(allowance: AllowanceCacheModel, decimal: number, formatter: string): AllowanceModel {
    return {
        amount: allowance.amount,
        ledgerAddress: allowance.ledgerAddress,
        spenderPrincipal: allowance.spenderPrincipal,
        spenderSubId: SubAccountId.parseFromString(allowance.spenderSubId),
        subAccountId: SubAccountId.parseFromString(allowance.subAccountId),
        expiration: convertBigIntToDateString(allowance.expiration, formatter),
        decimal: decimal
    };
}

export function allowanceFormToCache(form: CheckAllowanceForm, amount: bigint, expiration: bigint | undefined): AllowanceCacheModel {
    return {
        amount: amount,
        ledgerAddress: form.ledgerAddress,
        spenderPrincipal: form.spenderPrincipal,
        spenderSubId: form.spenderSubId.toString(),
        subAccountId: form.subAccountId.toString(),
        expiration: expiration
    };
}

export function allowanceCacheModelToDataModel(allowance: AllowanceCacheModel): AllowanceDataModel {
    return {
        amount: allowance.amount,
        ledgerAddress: allowance.ledgerAddress,
        spenderPrincipal: allowance.spenderPrincipal,
        spenderSubId: SubAccountId.parseFromString(allowance.spenderSubId),
        subAccountId: SubAccountId.parseFromString(allowance.subAccountId),
        expiration: allowance.expiration
    };
}