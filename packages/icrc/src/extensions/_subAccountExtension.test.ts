
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { orderBySubAccountId } from "@icrc/extensions/subAccountExtension";


describe("Unit subAssetExtension tests", () => {

    const tests = [
        {
            name: "orderBySubAccountId string empty a",
            input: {
                a: "",
                b: ""
            },
            data: {},
            result: 0
        },
        {
            name: "orderBySubAccountId string empty b",
            input: {
                a: "0x2",
                b: ""
            },
            data: {},
            result: 1
        },
        {
            name: "orderBySubAccountId more",
            input: {
                a: "0x2",
                b: "0x1"
            },
            data: {},
            result: 1
        },
        {
            name: "orderBySubAccountId equals",
            input: {
                a: "0x1",
                b: "0x1"
            },
            data: {},
            result: 0
        },
        {
            name: "orderBySubAccountId less",
            input: {
                a: "0x1",
                b: "0x2"
            },
            data: {},
            result: -1
        }
    ];

    itForeach(tests,
        async (test) => {
            const result = orderBySubAccountId({
                ledgerAddress: "",
                name: "",
                subAccountId: test.input.a
            }, {
                ledgerAddress: "",
                name: "",
                subAccountId: test.input.b
            });

            expect(result).toEqual(test.result);
        }
    );

});
