import { itValidate } from "@hpl/__tests_utils/itValidate";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { EditHplVirtualAccountInternalHandler, HplMintCacheDataHandler, HplOwnerCacheDataHandler, HplVirtualAccountCacheDataHandler } from "@hpl/internalHandlers";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit EditHplVirtualAccountInternalHandler validate tests", () => {

    const valid = {
        virtualAccountId: 1n,
        virtualAccountName: "Test",
        accountId: 1n,
        amount: 1n
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "EditHplVirtualAccountInternalHandler validation success",
        tests: [
            {
                name: "EditHplVirtualAccountInternalHandler: Field virtualAccountId is required",
                input: {
                    key: getPropertyName(valid, v => v.virtualAccountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("editing.hpl.virtual.account.internal.virtualAccountId.is.required",
                    "virtualAccountId",
                    "Field virtualAccountId is required")

            },
            {
                name: "EditHplVirtualAccountInternalHandler: Field accountId is required",
                input: {
                    key: getPropertyName(valid, v => v.accountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("editing.hpl.virtual.account.internal.accountId.is.required",
                    "accountId",
                    "Field accountId is required")

            },
            {
                name: "EditHplVirtualAccountInternalHandler: Field amount is required",
                input: {
                    key: getPropertyName(valid, v => v.amount),
                    value: undefined
                },
                result: {},
                error: new ValidationError("editing.hpl.virtual.account.internal.amount.is.required",
                    "amount",
                    "Field amount is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input) => {
        const logger = new MockLogger();
        const identifierService = await seedToIdentifierService("b");
        const hplVirtualAccountCacheDataHandler = new (<new () => HplVirtualAccountCacheDataHandler><unknown>HplVirtualAccountCacheDataHandler)() as jest.Mocked<HplVirtualAccountCacheDataHandler>;
        const hplMintCacheDataHandler = new (<new () => HplMintCacheDataHandler><unknown>HplMintCacheDataHandler)() as jest.Mocked<HplMintCacheDataHandler>;
        const hplOwnerCacheDataHandler = new (<new () => HplOwnerCacheDataHandler><unknown>HplOwnerCacheDataHandler)() as jest.Mocked<HplOwnerCacheDataHandler>;
        const editHplVirtualAccountInternalHandler = new EditHplVirtualAccountInternalHandler(
            logger,
            identifierService,
            mockCanisterService,
            hplVirtualAccountCacheDataHandler,
            hplOwnerCacheDataHandler,
            hplMintCacheDataHandler);

        await editHplVirtualAccountInternalHandler.validate(input);

    });

});
