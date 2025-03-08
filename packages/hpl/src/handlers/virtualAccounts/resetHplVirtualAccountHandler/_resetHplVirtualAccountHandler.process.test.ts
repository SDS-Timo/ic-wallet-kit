import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { ResetHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/resetHplVirtualAccountHandler/resetHplVirtualAccountHandler";
import { ResetHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";

describe("Unit ResetHplVirtualAccountHandler tests", () => {
    const testData = [
        {
            name: "Reset VirtualAccount",
            input: {
                virtualAccountId: BigInt(0)
            },
            result: {}
        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();
        const resetHplVirtualAccountInternalHandler = new (<new () => ResetHplVirtualAccountInternalHandler><unknown>ResetHplVirtualAccountInternalHandler)() as jest.Mocked<ResetHplVirtualAccountInternalHandler>;
        resetHplVirtualAccountInternalHandler.process = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const resetHplVirtualAccountHandler = new ResetHplVirtualAccountHandler(logger, resetHplVirtualAccountInternalHandler);
        const result = await resetHplVirtualAccountHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(resetHplVirtualAccountInternalHandler.process).toHaveBeenCalledWith(test.input);
    });
})
