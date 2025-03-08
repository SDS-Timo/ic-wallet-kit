import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { AddHplVirtualAccountForm } from "@hpl/forms";
import { AddHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/addHplVirtualAccountHandler/addHplVirtualAccountHandler";
import { AddHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { HplVirtualAccount } from "@hpl/types";

describe("Unit AddHplVirtualAccountHandler process tests", () => {

    const form: AddHplVirtualAccountForm = {
        assetId: 1n,
        accountId: 1n,
        virtualAccountName: "Test",
        accessByPrincipal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
        amount: 1n
    };

    const validData = {
        virtualAccountHandler: {
            isSuccess: true,
            data: {
                accessBy: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                accountId: 1n,
                amount: 1n,
                assetId: 1n,
                assetSymbol: "T",
                name: "Test",
                virtualAccountId: 1n,
                currencyAmount: "",
                code: "043",
                isMint: false
            }
        }
    }

    const tests = [
        {
            name: "AddHplVirtualAccountHandler: success",
            input: form,
            data: validData,
            result:
                {
                    accessBy: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                    accountId: 1n,
                    amount: 1n,
                    assetId: 1n,
                    assetSymbol: "T",
                    name: "Test",
                    virtualAccountId: 1n,
                    currencyAmount: "",
                    code: "043",
                    isMint: false
                } as HplVirtualAccount
        },
        {
            name: "AddHplVirtualAccountHandler: addHplVirtualAccountInternalHandler error",
            input: form,
            data: {
                ...validData, virtualAccountHandler: {
                    isSuccess: false,
                    data: undefined,
                    errors: [new Error("addHplVirtualAccountInternalHandler error")]

                }
            },
            result: {},
            error: [new Error("addHplVirtualAccountInternalHandler error")]

        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const addHplVirtualAccountInternalHandler = new (<new () => AddHplVirtualAccountInternalHandler><unknown>AddHplVirtualAccountInternalHandler)() as jest.Mocked<AddHplVirtualAccountInternalHandler>;
        addHplVirtualAccountInternalHandler.handle = jest.fn().mockResolvedValue(Promise.resolve(test.data.virtualAccountHandler));
        const hplVirtualAccountRepository = new (<new () => HplVirtualAccountRepository><unknown>HplVirtualAccountRepository)() as jest.Mocked<HplVirtualAccountRepository>;
        hplVirtualAccountRepository.addVirtualAccount = jest.fn().mockResolvedValue(Promise.resolve(undefined));
        const addHplVirtualAccountHandler = new AddHplVirtualAccountHandler(logger,
            addHplVirtualAccountInternalHandler,
            hplVirtualAccountRepository
        );

        const result = await addHplVirtualAccountHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(addHplVirtualAccountInternalHandler.handle).toHaveBeenCalledWith(test.input);

        expect(hplVirtualAccountRepository.addVirtualAccount).toHaveBeenCalledWith(
            expect.objectContaining({
                id: result.virtualAccountId.toString(),
                accountId: result.accountId.toString(),
                name: test.input.virtualAccountName
            })
        );
    });

});
