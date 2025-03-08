export class AmountProvider {

    static stringToBigInt(value: string, decimal: number): bigint | undefined {

        if (!isNaN(value as any)) { // validate is string valid number

            const parts = value.split(".");
            const hole = parts[0];
            const dec = parts[1] ?? "";

            if (dec.length <= decimal) { // make sure that length of decimal part more that string input
                let addZeros = "";
                for (let index = 0; index < decimal - dec.length; index++) {
                    addZeros = "0" + addZeros;
                }
                return BigInt(hole + dec + addZeros);
            }
        }

        return undefined;
    }

    static toBigInt(value: Amount, decimal: number): bigint | undefined {

        if (typeof value === typeof (0n)) {
            return value as any;
        }
        else {
            return this.stringToBigInt(value as any, decimal);
        }

    }

    static bigIntToDisplay(value: bigint, decimal: number): string {
        const numb = Number(value)
        const divisor = Math.pow(10, decimal)
        return (numb / divisor).toString();
    }

}

export type Amount = bigint | string;
