import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { IdentifierService } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { CkERC20Wrapper } from "@icrc/wrappers/ckERC20/ckERC20Wrapper";

describe("Integration ckERC20Wrapper getCkERC20Tokens tests", () => {

    const testData =
        [
            {
                name: "getCkERC20Tokens any result",
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

            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;

            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))

            it(test.name, async () => {

                let ckERC20Wrapper = new CkERC20Wrapper(new MockLogger(), identifierService);

                try {

                    const result = await ckERC20Wrapper.getCkERC20Tokens();
                    expect(test.data.result).toBeLessThan(result.length);
                }
                catch (e: any) {
                    expect(e.message).toEqual(test.data.resultError);
                }
            });
        }
    }
});