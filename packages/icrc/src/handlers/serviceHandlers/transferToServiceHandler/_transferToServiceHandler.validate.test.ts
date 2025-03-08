import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@icrc/__tests_utils/testDefinition";
import { TransferToServiceHandler } from "@icrc/handlers";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountId } from "@icrc/types";
import { TransferForm } from "@icrc/types/forms";

describe("TransferToServiceHandler Validation Tests", () => {
    const validForm: TransferForm = {
        fromPrincipal: "mock-from-principal",
        toPrincipal: "mock-to-principal",
        amount: "10",
        fromSubId: SubAccountId.parseFromString("0x2"),
        toSubId: SubAccountId.parseFromString("0x4")
    };

    const tests: testValidate<testValidateDefinition> = {
        name: "TransferToServiceHandler Validation Tests",
        tests: [
            {
                name: "TransferToServiceHandler: Field fromPrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.fromPrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.to.service.fromPrincipal.is.required",
                    "fromPrincipal",
                    "Field fromPrincipal is required"
                ),
            },
            {
                name: "TransferToServiceHandler: Field toPrincipal is required",
                input: {
                    key: getPropertyName(validForm, (v) => v.toPrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "transfer.to.service.toPrincipal.is.required",
                    "toPrincipal",
                    "Field toPrincipal is required"
                ),
            }
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
            const getSubAccountByHandler = new (<new () => GetSubAccountByHandler><unknown>GetSubAccountByHandler)() as jest.Mocked<GetSubAccountByHandler>;

            const handler = new TransferToServiceHandler(
                logger,
                assetMetaDataHandler,
                identifierService,
                getSubAccountByHandler
            );

            await handler.validate(input);
        }
    );
});
