import { LoadType, ValidationError } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { TransferFromServiceHandler } from "@icrc/handlers";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceAssetDetailsHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { SubAccountId } from "@icrc/types";
import { TransferFromServiceForm } from "@icrc/types/forms/transfers/transferFromServiceForm";
import { Icrc84ActorWrapper } from "@icrc/wrappers";

describe("TransferFromServiceHandler Process Tests", () => {
    const validForm: TransferFromServiceForm = {
        fromPrincipal: "from-principal",
        ledgerAddress: "mock-ledger-address",
        toPrincipal: mockAnonymousIdentifierService().getPrincipalStr(),
        amount: "10",
        toSubId: SubAccountId.Default()
    };

    const tests: testDefinition[] = [
        {
            name: "TransferFromServiceHandler: Successfully transfers from service",
            input: { ...validForm },
            data: {
                assetMetaData: { decimals: 8 },
                serviceAssetCredit: { ledgerAddress: "mock-ledger-address", credit: BigInt(10000000000000) },
                serviceAssetDetails: { withdrawalFee: BigInt(10) },
            },
            result: {
                servicePrincipal: "from-principal",
                ledgerAddress: "mock-ledger-address",
                credit: BigInt(10000000000000),
                deposit: BigInt(0),
            },
        },
        {
            name: "TransferFromServiceHandler: Sent amount should be less than balance",
            input: { ...validForm },
            data: {
                assetMetaData: { decimals: 8 },
                serviceAssetCredit: { credit: BigInt(1000) },
                serviceAssetDetails: { withdrawalFee: BigInt(10) },
            },
            error: new ValidationError("transfer.from.no.enough.balance",
                "amount",
                "Sent amount should be less than balance")
        },
        {
            name: "TransferFromServiceHandler: Invalid amount",
            input: { ...validForm, amount: "xxx" },
            data: {
                assetMetaData: { decimals: 8 },
                serviceAssetCredit: { credit: BigInt(1000) },
                serviceAssetDetails: { withdrawalFee: BigInt(10) },
            },
            error: new ValidationError("transfer.service.invalid.amount", "amount", "Invalid amount")
        },
        {
            name: "TransferFromServiceHandler: Amount should be more that 0",
            input: { ...validForm, amount: "-1" },
            data: {
                assetMetaData: { decimals: 8 },
                serviceAssetCredit: { credit: BigInt(10000000000000000000) },
                serviceAssetDetails: { withdrawalFee: BigInt(1000000000) },
            },
            error: new ValidationError("transfer.less.amount", "amount", "Amount should be more that 0")
        },
        {
            name: "TransferFromServiceHandler: Amount should be more that withdrawal fee",
            input: { ...validForm, amount: "0.01" },
            data: {
                assetMetaData: { decimals: 8 },
                serviceAssetCredit: { credit: BigInt(10000000000000000000) },
                serviceAssetDetails: { withdrawalFee: BigInt(1000000000) },
            },
            error: new ValidationError("transfer.amount.less.minimum.withdrawal", "amount", `Amount should be more that withdrawal fee: 1000000000`)
        },
        {
            name: "TransferFromServiceHandler: Asset not found",
            input: { ...validForm },
            data: {
                assetMetaData: undefined,
            },
            error: new ValidationError(
                "asset.not.found",
                "fromPrincipal",
                "Asset Not Found"
            ),
        }
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const serviceAssetCreditHandler = new (<new () => ServiceAssetCacheCreditHandler><unknown>ServiceAssetCacheCreditHandler)() as jest.Mocked<ServiceAssetCacheCreditHandler>;
        const serviceAssetDepositHandler = new (<new () => ServiceAssetDepositHandler><unknown>ServiceAssetDepositHandler)() as jest.Mocked<ServiceAssetDepositHandler>;
        const serviceAssetDetailsHandler = new (<new () => ServiceAssetDetailsHandler><unknown>ServiceAssetDetailsHandler)() as jest.Mocked<ServiceAssetDetailsHandler>;
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;

        const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
        Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);
        icrc84ActorWrapper.withdraw = jest.fn().mockResolvedValue(undefined);

        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data?.assetMetaData);
        subAccountBalanceHandler.handle = jest.fn().mockResolvedValue(undefined);
        serviceAssetCreditHandler.process = jest.fn().mockResolvedValue(test.data?.serviceAssetCredit);
        serviceAssetDetailsHandler.process = jest.fn().mockResolvedValue({ assetDetail: test.data?.serviceAssetDetails });
        serviceAssetDepositHandler.process = jest.fn().mockResolvedValue({ serviceAssetDeposit: BigInt(0) });

        const handler = new TransferFromServiceHandler(
            logger,
            assetMetaDataHandler,
            serviceAssetDetailsHandler,
            serviceAssetCreditHandler,
            serviceAssetDepositHandler,
            identifierService,
            subAccountBalanceHandler
        );

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(assetMetaDataHandler.handle).toHaveBeenCalledWith({
            ledgerAddress: test.input.ledgerAddress,
            loadType: LoadType.Quick,
        });
        expect(serviceAssetCreditHandler.process).toHaveBeenCalled();
        expect(serviceAssetDetailsHandler.process).toHaveBeenCalled();

    });
});
