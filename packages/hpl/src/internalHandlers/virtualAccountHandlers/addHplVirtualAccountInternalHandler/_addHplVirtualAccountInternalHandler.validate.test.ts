import { Principal } from "@dfinity/principal";
import { itValidate } from "@hpl/__tests_utils/itValidate";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { AddHplVirtualAccountInternalHandler, HplMintCacheDataHandler, HplOwnerCacheDataHandler } from "@hpl/internalHandlers";
import { HplDataCacheRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit AddHplVirtualAccountInternalHandler validate tests", () => {

    const valid = {
        virtualAccountName: "",
        assetId: 1n,
        accountId: 1n,
        accessByPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
        amount: 1n
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "AddHplVirtualAccountInternalHandler validation success",
        tests: [
            {
                name: "AddHplVirtualAccountInternalHandler: Field assetId is required",
                input: {
                    key: getPropertyName(valid, v => v.assetId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("adding.hpl.virtual.account.internal.assetId.is.required",
                    "assetId",
                    "Field assetId is required")

            },
            {
                name: "AddHplVirtualAccountInternalHandler: Field accountId is required",
                input: {
                    key: getPropertyName(valid, v => v.accountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("adding.hpl.virtual.account.internal.accountId.is.required",
                    "accountId",
                    "Field accountId is required")

            },
            {
                name: "AddHplVirtualAccountInternalHandler: Field accessByPrincipal is required",
                input: {
                    key: getPropertyName(valid, v => v.accessByPrincipal),
                    value: ""
                },
                result: {},
                error: new ValidationError("adding.hpl.virtual.account.internal.accessByPrincipal.is.required",
                    "accessByPrincipal",
                    "Field accessByPrincipal is required")

            },
            {
                name: "AddHplVirtualAccountInternalHandler: Field amount is required",
                input: {
                    key: getPropertyName(valid, v => v.amount),
                    value: undefined
                },
                result: {},
                error: new ValidationError("adding.hpl.virtual.account.internal.amount.is.required",
                    "amount",
                    "Field amount is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input) => {

        const logger = new MockLogger();

        const identifierService = await seedToIdentifierService("b");
        const hplDataCacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
        const hplMintCacheDataHandler = new (<new () => HplMintCacheDataHandler><unknown>HplMintCacheDataHandler)() as jest.Mocked<HplMintCacheDataHandler>;
        const hplOwnerCacheDataHandler = new (<new () => HplOwnerCacheDataHandler><unknown>HplOwnerCacheDataHandler)() as jest.Mocked<HplOwnerCacheDataHandler>;
        const addHplVirtualAccountInternalHandler = new AddHplVirtualAccountInternalHandler(
            logger,
            identifierService,
            mockCanisterService,
            hplDataCacheRepository,
            hplOwnerCacheDataHandler,
            hplMintCacheDataHandler);

        await addHplVirtualAccountInternalHandler.validate(input);

    });

});
