import { FormResult } from "@ic-wallet-middleware/common";

export const consoleOutput = (message: any): void => {
    console.log(message);
}

export const consoleOutputJson = (data: any): void => {
    const replacer = (key: any, value: any) => typeof value === "bigint" ? value.toString() : value;
    let message = JSON.stringify(data, replacer, 4);

    consoleOutput(message);
}

export const consoleOutputFormJson = (result: FormResult<any>): void => {
    if (result.isSuccess) {
        consoleOutputJson(result.data);
    }
    else {
        consoleOutputJson(result);
    }
}