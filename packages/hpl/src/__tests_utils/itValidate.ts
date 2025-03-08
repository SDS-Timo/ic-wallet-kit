import { itForeach } from "@hpl/__tests_utils/itForeach";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";


export function itValidate<T extends testValidateDefinition>(validForm: any, validData: any, test: testValidate<T>, fn: (input: any, data: any) => any) {

    it(test.name, async () => {
        await expect(fn(validForm, validData)).resolves.toBeUndefined();
    });

    itForeach(test.tests,
        async (test) => {

            const from = { ...validForm } as any;
            const name = test.input.key;
            from[name] = test.input.value;

            const data = { ...validData } as any;

            if (test.data) {
                const name = test.data.key;
                data[name] = test.data.value;
            }

            await fn(from, data);
        }
    );

}
