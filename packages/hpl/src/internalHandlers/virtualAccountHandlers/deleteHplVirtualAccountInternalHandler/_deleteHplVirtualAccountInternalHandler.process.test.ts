import { itForeach } from "@hpl/__tests_utils/itForeach";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { DeleteHplVirtualAccountInternalHandler } from "@hpl/internalHandlers/virtualAccountHandlers/deleteHplVirtualAccountInternalHandler/deleteHplVirtualAccountInternalHandler";

describe("Unit DeleteHplVirtualAccountInternalHandler tests", () => {

    const testData = [
        {
            name: "load assets",
            input: {
                virtualAccountId: 1n,
            },
            result: {
            }
        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();
        const identifierService = await seedToIdentifierService("b");
        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;
        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);
        ingressActorWrapper.deleteVirtualAccounts = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const deleteHplVirtualAccountInternalHandler = new DeleteHplVirtualAccountInternalHandler(
            logger,
            identifierService,
            mockCanisterService);
        const result = await deleteHplVirtualAccountInternalHandler.process(test.input);
        expect(result).toEqual(test.result);
    });
})
