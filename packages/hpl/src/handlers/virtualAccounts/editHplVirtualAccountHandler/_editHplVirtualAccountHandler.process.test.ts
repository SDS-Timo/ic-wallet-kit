import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { EditHplVirtualAccountForm } from "@hpl/forms";
import { EditHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/editHplVirtualAccountHandler/editHplVirtualAccountHandler";
import { EditHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { ValidationError } from "@ic-wallet-middleware/common";

describe("Unit EditHplVirtualAccountHandler process tests", () => {

    const form: EditHplVirtualAccountForm = {
        accountId: 1n,
        virtualAccountId: 1n,
        virtualAccountName: "Test VA",
        amount: 2n
    };
    const tests = [
        {
            name: "EditHplVirtualAccountHandler: success",
            input: form,
            data: {
                virtualAccounts: [
                    {
                        accountId: "1",
                        id: "1",
                        name: "Test"
                    }
                ],
                virtualAccount: {
                    virtualAccountId: 1n,
                    code: "043",
                    name: "Test VA",
                    amount: 2n,
                    currencyAmount: "",
                    accessBy: "",
                    isMint: false,
                    accountId: 1n,
                    assetId: 1n,
                    assetSymbol: ""
                }
            },
            result:
            {
                virtualAccountId: 1n,
                code: "043",
                name: "Test VA",
                amount: 2n,
                currencyAmount: "",
                accessBy: "",
                isMint: false,
                accountId: 1n,
                assetId: 1n,
                assetSymbol: ""
            }
        },
        {
            name: "EditHplVirtualAccountHandler: Virtual Account not found",
            input: form,
            data: {
                virtualAccounts: [],
                virtualAccount: {
                    virtualAccountId: 1n,
                    code: "043",
                    name: "Test VA",
                    amount: 2n,
                    currencyAmount: "",
                    accessBy: "",
                    isMint: false,
                    accountId: 1n,
                    assetId: 1n,
                    assetSymbol: ""
                }
            },
            result: {},
            error: new ValidationError(
                "virtual.account.not.found",
                "virtualAccountId",
                "Virtual Account not found")
        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();

        const editHplVirtualAccountInternalHandler = new (<new () => EditHplVirtualAccountInternalHandler><unknown>EditHplVirtualAccountInternalHandler)() as jest.Mocked<EditHplVirtualAccountInternalHandler>;
        editHplVirtualAccountInternalHandler.process = jest.fn().mockResolvedValue(Promise.resolve(test.data.virtualAccount));
        const hplVirtualAccountRepository = new (<new () => HplVirtualAccountRepository><unknown>HplVirtualAccountRepository)() as jest.Mocked<HplVirtualAccountRepository>;
        hplVirtualAccountRepository.getVirtualAccounts = jest.fn().mockResolvedValue(Promise.resolve(test.data.virtualAccounts));
        hplVirtualAccountRepository.updateVirtualAccount = jest.fn().mockResolvedValue(Promise.resolve(undefined));

        const editHplVirtualAccountHandler = new EditHplVirtualAccountHandler(logger,
            editHplVirtualAccountInternalHandler,
            hplVirtualAccountRepository
        );

        const result = await editHplVirtualAccountHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(editHplVirtualAccountInternalHandler.process).toHaveBeenCalledWith(test.input);

        expect(hplVirtualAccountRepository.updateVirtualAccount).toHaveBeenCalledWith(
            expect.objectContaining({
                id: result.virtualAccountId.toString(),
                accountId: result.accountId.toString(),
                name: test.input.virtualAccountName
            })
        );
    });

});
