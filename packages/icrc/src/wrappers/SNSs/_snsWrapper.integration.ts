
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { SnsWrapper } from "@icrc/wrappers/SNSs/snsWrapper";

describe("Integration snsTokenWrapper getSNSTokens tests", () => {

    const testData =
        [
            {
                name: "getSNSTokens any result",
                enable: true,
                data:
                {
                    input: {},
                    result: 0,
                    resultError: ""
                }
            }
        ];

    for (let test of testData) {

        if (test.enable) {

            it(test.name, async () => {

                let snsWrapper = new SnsWrapper(new MockLogger());

                try {
                    const result = await snsWrapper.getSNSTokens();
                    expect(test.data.result).toBeLessThan(result.length);
                }
                catch (e: any) {
                    expect(e.message).toEqual(test.data.resultError);
                }
            });
        }
    }
});