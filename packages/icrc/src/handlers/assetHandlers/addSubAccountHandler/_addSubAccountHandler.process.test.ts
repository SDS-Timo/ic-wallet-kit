import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { AddSubAccountForm } from "@icrc/types/forms";

import { LoadType, ValidationError } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddSubAccountHandler } from "@icrc/handlers";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";

describe("AddSubAccountHandler Process Tests", () => {
    const validForm: AddSubAccountForm = {
        ledgerAddress: mockLedgerAddress,
        subAccountId: SubAccountId.Default(),
        subAccountName: "Test Sub-Account",
    };

    const validData = {
        asset: {
            ledgerAddress: mockLedgerAddress,
            logo: "test-logo-url",
            subAccounts: [{
                ledgerAddress: mockLedgerAddress,
                subAccountId: "0x4",
                name: "name"
            }]
        }
    };


    const tests: testDefinition[] = [
        {
            name: "AddSubAccountHandler: Asset Not Found",
            input: validForm,
            data: { ...validData, asset: undefined },
            error: new ValidationError("asset.not.found", "ledgerAddress", "Asset Not Found")
        },
        {
            name: "AddSubAccountHandler: Sub-account already exists",
            input: { ...validForm, subAccountId: SubAccountId.parseFromString("0x4") },
            data: validData,
            error: new ValidationError("sub.account.already.exists", "subAccountId", "Sub-account already exists")
        },
        {
            name: "AddSubAccountHandler: success",
            input: validForm,
            data: validData,
            result: {}
        }

    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const getSubAccountByHandler = new (<new () => GetSubAccountByHandler><unknown>GetSubAccountByHandler)() as jest.Mocked<GetSubAccountByHandler>;

        assetRepository.getAssetOrDefault = jest.fn().mockResolvedValue(test.data.asset);

        getSubAccountByHandler.process = jest.fn().mockResolvedValue({
            ledgerAddress: test.input.ledgerAddress,
            subAccountId: test.input.subAccountId,
        });

        assetRepository.addSubAccount = jest.fn().mockResolvedValue(undefined);

        const addSubAccountHandler = new AddSubAccountHandler(logger, assetRepository, getSubAccountByHandler);

        await addSubAccountHandler.process(test.input);

        expect(assetRepository.getAssetOrDefault).toHaveBeenCalledWith(test.input.ledgerAddress);

        expect(getSubAccountByHandler.process).toHaveBeenCalledWith({
            ledgerAddress: test.input.ledgerAddress,
            subAccountId: test.input.subAccountId,
            loadType: LoadType.Quick,
        });

        expect(assetRepository.addSubAccount).toHaveBeenCalledWith({
            ledgerAddress: test.input.ledgerAddress,
            name: test.input.subAccountName,
            subAccountId: test.input.subAccountId.toString()
        });
    });


});
