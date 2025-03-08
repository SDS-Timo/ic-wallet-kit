import { itValidate } from "@hpl/__tests_utils/itValidate";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { AccountTransferModel } from "@hpl/forms";
import { TransferHandler } from "@hpl/handlers/transfer/transferHandler/transferHandler";
import { HplFtAssetCacheDataHandler } from "@hpl/internalHandlers";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit TransferHandler validate tests", () => {

    const valid = {
        txFrom: {
            type: "sub",
            id: BigInt(1)
        } as AccountTransferModel,
        txTo: {
            type: "sub",
            id: BigInt(3)
        } as AccountTransferModel,
        amount: "0",
        assetId: BigInt(3)
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "TransferHandler validation success",
        tests: [
            {
                name: "TransferHandler: Field assetId is required",
                input: {
                    key: getPropertyName(valid, v => v.assetId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("hpl.transfer.assetId.is.required",
                    "assetId",
                    "Field assetId is required")

            },
            {
                name: "TransferHandler: Field amount is required",
                input: {
                    key: getPropertyName(valid, v => v.amount),
                    value: undefined
                },
                result: {},
                error: new ValidationError("hpl.transfer.amount.is.required",
                    "amount",
                    "Field amount is required")

            },
            {
                name: "TransferHandler: Field from is required",
                input: {
                    key: getPropertyName(valid, v => v.txFrom),
                    value: undefined
                },
                result: {},
                error: new ValidationError("hpl.transfer.from.is.required",
                    "txFrom",
                    "Field from is required")

            },
            {
                name: "TransferHandler: Field to is required",
                input: {
                    key: getPropertyName(valid, v => v.txTo),
                    value: undefined
                },
                result: {},
                error: new ValidationError("hpl.transfer.to.is.required",
                    "txTo",
                    "Field to is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");
        const hplFtAssetCacheDataHandler = new (<new () => HplFtAssetCacheDataHandler><unknown>HplFtAssetCacheDataHandler)() as jest.Mocked<HplFtAssetCacheDataHandler>;
        const transferHandler = new TransferHandler(logger, identifierService, mockCanisterService, hplFtAssetCacheDataHandler);

        await transferHandler.validate(input);

    });

});
