import { AmountProvider } from "@common/utils/amountProvider";


describe("Unit AmountProvider Tests", () => {


    const testData =
        [
            {
                name: "AmountProvider int success",
                enable: true,
                input: {
                    value: "423",
                    decimal: 8
                },
                result: 42300000000n
            },
            {
                name: "AmountProvider int with point success",
                enable: true,
                input: {
                    value: "423.",
                    decimal: 8
                },
                result: 42300000000n
            },
            {
                name: "AmountProvider decimal success",
                enable: true,
                input: {
                    value: "423.66",
                    decimal: 8
                },
                result: 42366000000n
            },
            {
                name: "AmountProvider decimal equals length of decimal symbols",
                enable: true,
                input: {
                    value: "423.12345678",
                    decimal: 8
                },
                result: 42312345678n
            },
            {
                name: "AmountProvider decimal with characters fail",
                enable: true,
                input: {
                    value: "423.662a",
                    decimal: 8
                },
                result: undefined
            },
            {
                name: "AmountProvider decimal wrong length after point",
                enable: true,
                input: {
                    value: "423.123456789",
                    decimal: 8
                },
                result: undefined
            },
            {
                name: "AmountProvider: toBigInt big int",
                enable: true,
                input: {
                    value: BigInt(10),
                    decimal: 8
                },
                result: 10n
            }
        ];

    for (let test of testData) {

        if (test.enable) {

            it(test.name, async () => {

                const result = AmountProvider.toBigInt(test.input.value, test.input.decimal);

                expect(result).toEqual(test.result);

            });
        }
    }
});

describe("Unit AmountProvider bigIntToDisplay Tests", () => {
    const testData =
        [
            {
                name: "AmountProvider bigIntToString int success",
                enable: true,
                input: {
                    value: 42300000000n,
                    decimal: 8
                },
                result: "423"
            },
            {
                name: "AmountProvider bigIntToString decimal success",
                enable: true,
                input: {
                    value: 42366000000n,
                    decimal: 8
                },
                result: "423.66"
            },
            {
                name: "AmountProvider bigIntToString decimal equals length of decimal symbols",
                enable: true,
                input: {
                    value: 42312345678n,
                    decimal: 8
                },
                result: "423.12345678"
            },
        ];

    for (let test of testData) {

        if (test.enable) {

            it(test.name, async () => {

                const result = AmountProvider.bigIntToDisplay(test.input.value, test.input.decimal);

                expect(result).toEqual(test.result);

            });
        }
    }

});
