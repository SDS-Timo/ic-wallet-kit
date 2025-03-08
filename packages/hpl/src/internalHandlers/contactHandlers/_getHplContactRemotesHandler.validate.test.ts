import { Principal } from "@dfinity/principal";
import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { GetHplContactRemotesHandler, HplDictionaryCacheDataHandler, HplOwnerCacheDataHandler, HplRemoteAccountsStateCacheDataHandler, HplRemotesCacheDataHandler } from "@hpl/internalHandlers";
import { HplAssetRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit GetHplContactRemotesHandler validate tests", () => {

    const valid = {
        principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe")
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "GetHplContactRemotesHandler validation success",
        tests: [
            {
                name: "GetHplContactRemotesHandler: Field principal is required",
                input: {
                    key: getPropertyName(valid, v => v.principal),
                    value: ""
                },
                result: {},
                error: new ValidationError("adding.hpl.account.internal.principal.is.required",
                    "principal",
                    "Field principal is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input) => {

        const logger = new MockLogger();

        const hplRemotesCacheDataHandler = new (<new () => HplRemotesCacheDataHandler><unknown>HplRemotesCacheDataHandler)() as jest.Mocked<HplRemotesCacheDataHandler>;
        const hplRemoteAccountsStateCacheDataHandler = new (<new () => HplRemoteAccountsStateCacheDataHandler><unknown>HplRemoteAccountsStateCacheDataHandler)() as jest.Mocked<HplRemoteAccountsStateCacheDataHandler>;
        const hplOwnerCacheDataHandler = new (<new () => HplOwnerCacheDataHandler><unknown>HplOwnerCacheDataHandler)() as jest.Mocked<HplOwnerCacheDataHandler>;
        const hplAssetRepository = new (<new () => HplAssetRepository><unknown>HplAssetRepository)() as jest.Mocked<HplAssetRepository>;
        const hplDictionaryCacheDataHandler = new (<new () => HplDictionaryCacheDataHandler><unknown>HplDictionaryCacheDataHandler)() as jest.Mocked<HplDictionaryCacheDataHandler>;

        const getHplContactRemotesHandler = new GetHplContactRemotesHandler(logger,
            hplRemotesCacheDataHandler,
            hplRemoteAccountsStateCacheDataHandler,
            hplOwnerCacheDataHandler,
            hplAssetRepository,
            hplDictionaryCacheDataHandler
        );

        await getHplContactRemotesHandler.validate(input);

    });

});
