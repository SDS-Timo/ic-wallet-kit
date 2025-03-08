import { LoadType, ValidationError } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockOwnerPrincipalString, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { TransferToServiceHandler } from "@icrc/handlers/serviceHandlers/transferToServiceHandler/transferToServiceHandler";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountId } from "@icrc/types";
import { TransferForm } from "@icrc/types/forms";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

describe("TransferToServiceHandler Process Tests", () => {
    const validForm: TransferForm = {
        fromPrincipal: mockOwnerPrincipalString(),
        toPrincipal: mockSpenderPrincipalString(),
        amount: "10",
        fromSubId: SubAccountId.parseFromString("0x2"),
        toSubId: SubAccountId.parseFromString("0x4")
    };


    const tests: testDefinition[] = [
        {
            name: "TransferToServiceHandler: Successfully transfers to service",
            input: { ...validForm },
            data: {
                assetMetaData: { decimals: 8, fee: BigInt(10) },
                subAccountBalance: BigInt(100000000000000000000000),
            },
            result: {},
        },
        {
            name: "TransferToServiceHandler: Asset not found",
            input: { ...validForm },
            data: {
                assetMetaData: undefined,
            },
            error: new ValidationError(
                "asset.not.found",
                "fromPrincipal",
                "Asset Not Found"
            ),
        },
        {
            name: "TransferToServiceHandler: Invalid amount",
            input: { ...validForm, amount: "xxx" },
            data: {
                assetMetaData: { decimals: 8, fee: BigInt(10) },
                subAccountBalance: BigInt(5),
            },
            error: new ValidationError("transfer.service.invalid.amount", "amount", "Invalid amount")
        },
        {
            name: "TransferToServiceHandler: Amount should be more that 0",
            input: { ...validForm, amount: "-1" },
            data: {
                assetMetaData: { decimals: 8, fee: BigInt(10) },
                subAccountBalance: BigInt(5),
            },
            error: new ValidationError("balance.less.amount", "sentAmount", "Amount should be more that 0")
        },
        {
            name: "TransferToServiceHandler: Sent amount should be less than balance",
            input: { ...validForm },
            data: {
                assetMetaData: { decimals: 8, fee: BigInt(10) },
                subAccountBalance: BigInt(5),
            },
            error: new ValidationError("balance.less.amount", "sentAmount", "Sent amount should be less than balance")
        },
        {
            name: "TransferToServiceHandler: Sent amount should be less than balance undefined",
            input: { ...validForm },
            data: {
                assetMetaData: { decimals: 8, fee: BigInt(10) },
                subAccountBalance: undefined
            },
            error: new ValidationError("balance.less.amount", "sentAmount", "Sent amount should be less than balance")
        }
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const getSubAccountByHandler = new (<new () => GetSubAccountByHandler><unknown>GetSubAccountByHandler)() as jest.Mocked<GetSubAccountByHandler>;
        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;

        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);
        ledgerWrapper.transfer = jest.fn().mockResolvedValue(undefined);

        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data?.assetMetaData);
        getSubAccountByHandler.handle = jest.fn().mockResolvedValue({
            data: { balance: test.data?.subAccountBalance },
        });

        const handler = new TransferToServiceHandler(
            logger,
            assetMetaDataHandler,
            identifierService,
            getSubAccountByHandler
        );


        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);


        expect(assetMetaDataHandler.handle).toHaveBeenCalledWith({
            ledgerAddress: test.input.fromPrincipal,
            loadType: LoadType.Quick,
        });
        expect(getSubAccountByHandler.handle).toHaveBeenCalledWith({
            ledgerAddress: test.input.fromPrincipal,
            loadType: LoadType.Quick,
            subAccountId: test.input.fromSubId,
        });
        expect(ledgerWrapper.transfer).toHaveBeenCalled();

    });
});
