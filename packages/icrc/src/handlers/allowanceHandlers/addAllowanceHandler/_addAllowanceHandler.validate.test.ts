import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockAssetManagerConfiguration } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddAllowanceHandler } from "@icrc/handlers/allowanceHandlers/addAllowanceHandler/addAllowanceHandler";
import { AddIcrcAllowanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/addIcrcAllowanceHandler/addIcrcAllowanceHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AllowanceRepository, AssetRepository } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";


describe("Unit AddAllowanceHandler validate tests", () => {

    const valid = {
        amount: "10",
        ledgerAddress: "xxx",
        spenderPrincipal: "xxxx",
        spenderSubId: SubAccountId.Default(),
        subAccountId: SubAccountId.Default(),
        expiration: undefined
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "AddAllowanceHandler validation success",
        tests: [
            {
                name: "AddAllowanceHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(valid, v => v.ledgerAddress),
                    value: ""
                },
                result: {},
                error: new ValidationError("adding.allowance.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required")

            },
            {
                name: "AddAllowanceHandler: Field spender is required",
                input: {
                    key: getPropertyName(valid, v => v.spenderPrincipal),
                    value: ""
                },
                result: {},
                error: new ValidationError("adding.allowance.spender.is.required",
                    "spender",
                    "Field spender is required")
            },
            {
                name: "AddAllowanceHandler: Field amount is required",
                input: {
                    key: getPropertyName(valid, v => v.amount),
                    value: ""
                },
                result: {},
                error: new ValidationError("adding.allowance.amount.is.required",
                    "amount",
                    "Field amount is required")
            },
            {
                name: "AddAllowanceHandler: Allowance already exists",
                input: {
                    key: getPropertyName(valid, v => v.amount),
                    value: "10"
                },
                data: {
                    key: getPropertyName(validData, v => v.exists),
                    value: true
                },
                result: {},
                error: new ValidationError("adding.allowance.already.exists", "", "Allowance already exists")
            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const allowanceRepository = new (<new () => AllowanceRepository><unknown>AllowanceRepository)() as jest.Mocked<AllowanceRepository>;
        const addIcrcAllowanceHandler = new (<new () => AddIcrcAllowanceHandler><unknown>AddIcrcAllowanceHandler)() as jest.Mocked<AddIcrcAllowanceHandler>;
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;

        allowanceRepository.isExistStorageAllowance = jest.fn().mockReturnValue(validData.exists);

        const addAllowanceHandler = new AddAllowanceHandler(logger,
            assetMetaDataHandler,
            assetRepository,
            allowanceRepository,
            addIcrcAllowanceHandler,
            mockAssetManagerConfiguration,
            subAccountBalanceHandler
        );

        await addAllowanceHandler.validate(input);

    });

});
