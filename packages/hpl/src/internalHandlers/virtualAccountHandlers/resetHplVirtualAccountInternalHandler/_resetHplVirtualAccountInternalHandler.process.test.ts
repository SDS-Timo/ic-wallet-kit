import { itForeach } from "@hpl/__tests_utils/itForeach";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { EditHplVirtualAccountForm } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplVirtualAccountStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplVirtualAccountStateCacheDataHandler/hplVirtualAccountStateCacheDataHandler";
import { ResetHplVirtualAccountInternalHandler } from "@hpl/internalHandlers/virtualAccountHandlers/resetHplVirtualAccountInternalHandler/resetHplVirtualAccountInternalHandler";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types";
import { ValidationError } from "@ic-wallet-middleware/common";

describe("Unit ResetHplVirtualAccountInternalHandler tests", () => {
    const testData = [
        {
            name: "reset virtual account",
            input: {
                virtualAccountId: BigInt(5)
            } as EditHplVirtualAccountForm,
            data: {
                hplCacheData:
                    {
                        accountId: BigInt(0),
                        accountState: {
                            ft: BigInt(0)
                        },
                        virtualAccountId: BigInt(5),
                        time: BigInt(0)

                    } as HplStateVirtualAccountsCacheModel
            },
            result: {}
        },
        {
            name: "reset virtual account, cache is empty",
            input: {
                virtualAccountId: BigInt(5)
            } as EditHplVirtualAccountForm,
            data: {
                hplCacheData: undefined
            },
            result: {},
            error: new ValidationError("virtual.account.state.not.found",
                "virtualAccountId",
                "Virtual Account State not found")
        }
    ]

    itForeach(testData, async (test) => {

        const identifierService = seedToIdentifierService("a");
        const hplVirtualAccountStateCacheDataHandler = new (<new () => HplVirtualAccountStateCacheDataHandler><unknown>HplVirtualAccountStateCacheDataHandler)() as jest.Mocked<HplVirtualAccountStateCacheDataHandler>;
        hplVirtualAccountStateCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.hplCacheData));

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;
        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);
        ingressActorWrapper.updateVirtualAccount = jest.fn().mockReturnValue(Promise.resolve([0n, 0n]));

        const logger = new MockLogger();
        const resetHplVirtualAccountInternalHandler = new ResetHplVirtualAccountInternalHandler(
            logger,
            identifierService,
            mockCanisterService,
            hplVirtualAccountStateCacheDataHandler
        );

        const result = await resetHplVirtualAccountInternalHandler.process(test.input);
        expect(result).toEqual(test.result);
    });
})
