import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { NotifyServiceHandler } from "@icrc/handlers/serviceHandlers/notifyServiceHandler/notifyServiceHandler";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { NotifyForm } from "@icrc/types/forms";

describe("NotifyServiceHandler Validation Tests", () => {
    const validForm: NotifyForm = {
        servicePrincipal: "mock-service-principal",
        ledgerAddress: mockLedgerAddress,
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "NotifyServiceHandler Validation Tests",
        tests: [
            {
                name: "NotifyServiceHandler: Field servicePrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.servicePrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "notify.service.servicePrincipal.is.required",
                    "servicePrincipal",
                    "Field servicePrincipal is required"
                ),
            },
            {
                name: "NotifyServiceHandler: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "notify.service.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
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
            const serviceAssetCreditHandler = new (<new () => ServiceAssetCacheCreditHandler><unknown>ServiceAssetCacheCreditHandler)() as jest.Mocked<ServiceAssetCacheCreditHandler>;
            const serviceAssetDepositHandler = new (<new () => ServiceAssetDepositHandler><unknown>ServiceAssetDepositHandler)() as jest.Mocked<ServiceAssetDepositHandler>;

            const handler = new NotifyServiceHandler(logger, identifierService, serviceAssetCreditHandler, serviceAssetDepositHandler);

            await handler.validate(input);
        }
    );
});
