import { testDefinition } from "@icrc/__tests_utils/testDefinition";


export function itForeach<T extends testDefinition>(tests: T[], fn: (arg: T) => any) {

    it.each(tests)("$name",
        async (test) => {

            try {
                await fn(test);

                if (test.error) {
                    throw new Error("Test doesn't throw error as expected");
                }

            }
            catch (e) {

                if (test.error) {
                    expect(e).toEqual(test.error);
                }
                else {
                    throw e;
                }
            }
        }
    );

}
