export const processSubAccountId = (subAccountId: string) => {
    let result: string;

    result = subAccountId.slice(0, 2).toLowerCase() === "0x"
        ? subAccountId.substring(2)
        : subAccountId;

    result = removeLeadingZeros(result);

    result = `0x${result}`;

    return result;
}

export const removeLeadingZeros = (text: string): string => {
    let result = text.replace(/^0+/, "");

    if (result == "") {
        result = "0";
    }

    return result;
};

export const parseToIcrcAccountParam = (toIcrcAccount: string) => {
    const isSubAccount = testSubAccount(toIcrcAccount);
    if (isSubAccount) {
        return ["", toIcrcAccount];
    }

    let [principal, subAccount] = toIcrcAccount.split(".");

    if (subAccount && !testSubAccount(subAccount)) {
        const number = Number.parseInt(subAccount)
        if (number >= 0 && !Number.isNaN(number) && Number.isInteger(number)) {
            return `0x${number.toString(16)}`;
        }
        throw new Error("Invalid subAccount value");
    }

    return [principal, subAccount];
}

export const testSubAccount = (subAccount: string) => {
    return subAccount.slice(0, 2).toLowerCase() === "0x";
}