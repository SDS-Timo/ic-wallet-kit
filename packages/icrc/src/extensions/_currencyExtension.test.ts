import { getCurrencyAmount } from "@icrc/extensions/currencyExtension";


describe("Unit currencyExtension tests", () => {

    const tests = [
        {
            name: "getCurrencyAmount price undefined",
            input: {
                price: undefined,
                balance: 10n,

            },
            result: "0.00"
        },
        {
            name: "getCurrencyAmount price undefined",
            input: {
                price: 1,
                balance: 1000000n,

            },
            result: "0.01"
        }


    ];

    it.each(tests)("$name",
        async (test) => {

            const data = test.input.price ? {
                name: "xxx", price: test.input.price, symbol: "xxx"
            }
                : undefined;

            const result = getCurrencyAmount(data, test.input.balance, 8);

            expect(result).toEqual(test.result);
        }
    );



}

);
