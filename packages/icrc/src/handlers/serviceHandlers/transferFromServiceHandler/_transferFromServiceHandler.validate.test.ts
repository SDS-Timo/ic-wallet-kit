import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";

import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { TransferFromServiceHandler } from "@icrc/handlers";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceAssetDetailsHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { SubAccountId } from "@icrc/types";
import { TransferFromServiceForm } from "@icrc/types/forms/transfers/transferFromServiceForm";

describe("TransferFromServiceHandler Validation Tests", () => {
    const validForm: TransferFromServiceForm = {
        fromPrincipal: "mock-from-principal",
        ledgerAddress: "mock-ledger-address",
        toPrincipal: "mock-to-principal",
        amount: "10",
        toSubId: SubAccountId.Default()
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "TransferFromServiceHandler Validation Tests",
        tests: [
            {
                name: "TransferFromServiceHandler: Field fromPrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.fromPrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.service.fromPrincipal.is.required",
                    "fromPrincipal",
                    "Field fromPrincipal is required"
                ),
            },
            {
                name: "TransferFromServiceHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.service.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "TransferFromServiceHandler: Field toPrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.toPrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.service.toPrincipal.is.required",
                    "fromPrincipal",
                    "Field toPrincipal is required"
                ),
            },
        ],
    };

    itValidate(
        validForm,
        {},
        tests,
        async (input) => {
            const logger = new MockLogger();
            const identifierService = mockAnonymousIdentifierService();
            const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
            const serviceAssetCreditHandler = new (<new () => ServiceAssetCacheCreditHandler><unknown>ServiceAssetCacheCreditHandler)() as jest.Mocked<ServiceAssetCacheCreditHandler>;
            const serviceAssetDepositHandler = new (<new () => ServiceAssetDepositHandler><unknown>ServiceAssetDepositHandler)() as jest.Mocked<ServiceAssetDepositHandler>;
            const serviceAssetDetailsHandler = new (<new () => ServiceAssetDetailsHandler><unknown>ServiceAssetDetailsHandler)() as jest.Mocked<ServiceAssetDetailsHandler>;
            const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;

            const handler = new TransferFromServiceHandler(
                logger,
                assetMetaDataHandler,
                serviceAssetDetailsHandler,
                serviceAssetCreditHandler,
                serviceAssetDepositHandler,
                identifierService,
                subAccountBalanceHandler
            );

            await handler.validate(input);
        }
    );
});
