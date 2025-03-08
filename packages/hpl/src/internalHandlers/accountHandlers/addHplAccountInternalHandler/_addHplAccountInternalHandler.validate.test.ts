import { itValidate } from "@hpl/__tests_utils/itValidate";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { AddHplAccountInternalHandler } from "@hpl/internalHandlers";
import { HplDataCacheRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit AddHplAccountInternalHandler validate tests", () => {

    const valid = {
        assetId: 1n,
        accountName: "Test"
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "AddHplAccountInternalHandler validation success",
        tests: [
            {
                name: "AddHplAccountInternalHandler: Field assetId is required",
                input: {
                    key: getPropertyName(valid, v => v.assetId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("adding.hpl.account.internal.assetId.is.required",
                    "assetId",
                    "Field assetId is required")

            },
            {
                name: "AddHplAccountInternalHandler: Field accountName is required",
                input: {
                    key: getPropertyName(valid, v => v.accountName),
                    value: ""
                },
                result: {},
                error: new ValidationError("adding.hpl.account.internal.accountName.is.required",
                    "assetId",
                    "Field accountName is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const identifierService = await seedToIdentifierService("b");
        const hplDataCacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
        const addHplAccountInternalHandler = new AddHplAccountInternalHandler(logger, identifierService, mockCanisterService, hplDataCacheRepository);

        await addHplAccountInternalHandler.validate(input);

    });

});
