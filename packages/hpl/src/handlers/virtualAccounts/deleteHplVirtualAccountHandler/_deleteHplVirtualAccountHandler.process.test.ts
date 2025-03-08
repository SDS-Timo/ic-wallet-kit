import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { DeleteHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/deleteHplVirtualAccountHandler/deleteHplVirtualAccountHandler";
import { DeleteHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";

describe("Unit DeleteHplVirtualAccountHandler tests", () => {
    const testData = [
        {
            name: "DeleteHplVirtualAccountHandler: success",
            input: {
                virtualAccountId: 1n
            },
            result: {}
        },
    ]

    itForeach(testData, async (test) => {
        jest.restoreAllMocks();
        const logger = new MockLogger();
        const deleteHplVirtualAccountInternalHandler = new (<new () => DeleteHplVirtualAccountInternalHandler><unknown>DeleteHplVirtualAccountInternalHandler)() as jest.Mocked<DeleteHplVirtualAccountInternalHandler>;
        deleteHplVirtualAccountInternalHandler.process = jest.fn().mockReturnValue(Promise.resolve({}));
        const hplVirtualAccountRepository = new (<new () => HplVirtualAccountRepository><unknown>HplVirtualAccountRepository)() as jest.Mocked<HplVirtualAccountRepository>;
        hplVirtualAccountRepository.removeVirtualAccount = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const deleteHplVirtualAccountHandler = new DeleteHplVirtualAccountHandler(logger, deleteHplVirtualAccountInternalHandler, hplVirtualAccountRepository);
        const result = await deleteHplVirtualAccountHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(deleteHplVirtualAccountInternalHandler.process).toHaveBeenCalledWith(test.input);

        expect(hplVirtualAccountRepository.removeVirtualAccount).toHaveBeenCalledWith(
            test.input.virtualAccountId.toString()
        );
    });
})
