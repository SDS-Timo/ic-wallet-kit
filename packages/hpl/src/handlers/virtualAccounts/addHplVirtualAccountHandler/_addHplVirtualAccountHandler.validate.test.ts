import { Principal } from "@dfinity/principal";
import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { AddHplVirtualAccountForm } from "@hpl/forms";
import { AddHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/addHplVirtualAccountHandler/addHplVirtualAccountHandler";
import { AddHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit AddHplVirtualAccountHandler validate tests", () => {

    const valid: AddHplVirtualAccountForm = {
        assetId: 0n,
        accessByPrincipal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
        accountId: 1n,
        amount: 1n,
        virtualAccountName: ""
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "AddHplVirtualAccountHandler validation success",
        tests: [
            {
                name: "AddHplVirtualAccountHandler: Field assetId is required",
                input: {
                    key: getPropertyName(valid, v => v.assetId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("adding.hpl.virtual.account.assetId.is.required",
                    "assetId",
                    "Field assetId is required")

            },
            {
                name: "AddHplVirtualAccountHandler: Field accountId is required",
                input: {
                    key: getPropertyName(valid, v => v.accountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("adding.hpl.virtual.account.accountId.is.required",
                    "accountId",
                    "Field accountId is required")

            },
            {
                name: "AddHplVirtualAccountHandler: Field accessByPrincipal is required",
                input: {
                    key: getPropertyName(valid, v => v.accessByPrincipal),
                    value: ""
                },
                result: {},
                error: new ValidationError("adding.hpl.virtual.account.accessByPrincipal.is.required",
                    "accessByPrincipal",
                    "Field accessByPrincipal is required")

            },
            {
                name: "AddHplVirtualAccountHandler: Field amount is required",
                input: {
                    key: getPropertyName(valid, v => v.amount),
                    value: undefined
                },
                result: {},
                error: new ValidationError("adding.hpl.virtual.account.amount.is.required",
                    "amount",
                    "Field amount is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input) => {
        const logger = new MockLogger();
        const addHplVirtualAccountInternalHandler = new (<new () => AddHplVirtualAccountInternalHandler><unknown>AddHplVirtualAccountInternalHandler)() as jest.Mocked<AddHplVirtualAccountInternalHandler>;
        const hplVirtualAccountRepository = new (<new () => HplVirtualAccountRepository><unknown>HplVirtualAccountRepository)() as jest.Mocked<HplVirtualAccountRepository>;
        const addHplVirtualAccountHandler = new AddHplVirtualAccountHandler(logger,
            addHplVirtualAccountInternalHandler,
            hplVirtualAccountRepository
        );
        await addHplVirtualAccountHandler.validate(input);

    });

});