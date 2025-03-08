import { Principal } from "@dfinity/principal";
import { FormResult } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { TransferToServiceHandler } from "@icrc/handlers/serviceHandlers/transferToServiceHandler/transferToServiceHandler";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit ServiceAssetCacheCreditHandler tests", () => {
    const princBytes = Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe").toUint8Array();
    const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
    const testData = [
        {
            name: "transfer error",
            input: {
                amount: "0.0002",
                fromPrincipal: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                fromSubId: SubAccountId.parseFromString("0x1"),
                toPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                toSubId: SubAccountId.parseFromString(princSubId)
            },
            data: {
                metadata: {
                    symbol: "ICP",
                    name: "Internet Computer",
                    decimals: 8,
                    logo: "",
                    fee: BigInt(10000),
                },
                subAccount: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: "0x0",
                    balance: BigInt(3167000),
                    currencyAmount: "0.00",
                    decimal: 8,
                    name: "Default",
                    isSync: true,
                },
                success: false
            },
            result: FormResult.error([{
                fieldName: "",
                localizationKey: "default.error.message",
                message: "Anonymous principal cannot hold tokens on the ledger."
            }])
        },
        {
            name: "transfer success",
            input: {
                amount: "0.0002",
                fromPrincipal: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                fromSubId: SubAccountId.parseFromString("0x1"),
                toPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                toSubId: SubAccountId.parseFromString(princSubId)
            },
            data: {
                metadata: {
                    symbol: "ICP",
                    name: "Internet Computer",
                    decimals: 8,
                    logo: "",
                    fee: BigInt(10000),
                },
                subAccount: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: "0x0",
                    balance: BigInt(3167000),
                    currencyAmount: "0.00",
                    decimal: 8,
                    name: "Default",
                    isSync: true,
                },
                success: true
            },
            result: FormResult.success({})
        },
        {
            name: "error, Amount should be more that 0",
            input: {
                amount: "0",
                fromPrincipal: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                fromSubId: SubAccountId.parseFromString("0x1"),
                toPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                toSubId: SubAccountId.parseFromString(princSubId)
            },
            data: {
                metadata: {
                    symbol: "ICP",
                    name: "Internet Computer",
                    decimals: 8,
                    logo: "",
                    fee: BigInt(10000),
                },
                subAccount: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: "0x0",
                    balance: BigInt(0),
                    currencyAmount: "0.00",
                    decimal: 8,
                    name: "Default",
                    isSync: true,
                }
            },
            result: FormResult.error([{
                fieldName: "amount",
                localizationKey: "transfer.service.invalid.amount",
                message: "Invalid amount",
            }])
        },
        {
            name: "error, Sent amount should be less than balance ",
            input: {
                amount: "0.0002",
                fromPrincipal: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                fromSubId: SubAccountId.parseFromString("0x1"),
                toPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                toSubId: SubAccountId.parseFromString(princSubId)
            },
            data: {
                metadata: {
                    symbol: "ICP",
                    name: "Internet Computer",
                    decimals: 8,
                    logo: "",
                    fee: BigInt(10000),
                },
                subAccount: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: "0x0",
                    balance: BigInt(1000),
                    currencyAmount: "0.00",
                    decimal: 8,
                    name: "Default",
                    isSync: true,
                },
                success: true
            },
            result: FormResult.error([{
                fieldName: "sentAmount",
                localizationKey: "balance.less.amount",
                message: "Sent amount should be less than balance",
            }])
        },
        {
            name: "error, Asset Not Found",
            input: {
                amount: "0.0002",
                fromPrincipal: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                fromSubId: SubAccountId.parseFromString("0x1"),
                toPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                toSubId: SubAccountId.parseFromString(princSubId)
            },
            data: {
                metadata: undefined,
                subAccount: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: "0x0",
                    balance: BigInt(100000),
                    currencyAmount: "0.00",
                    decimal: 8,
                    name: "Default",
                    isSync: true,
                },
                success: true
            },
            result: FormResult.error([{
                fieldName: "fromPrincipal",
                localizationKey: "asset.not.found",
                message: "Asset Not Found",
            }])
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const logger = new MockLogger();

            const identifierService = mockAnonymousIdentifierService();
            const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
            const getSubAccountByHandler = new (<new () => GetSubAccountByHandler><unknown>GetSubAccountByHandler)() as jest.Mocked<GetSubAccountByHandler>;
            const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
            LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);

            if (test.data.success) {
                ledgerWrapper.transfer = jest.fn().mockResolvedValue({});
            }
            else {
                ledgerWrapper.transfer = jest.fn().mockRejectedValue(new Error("Anonymous principal cannot hold tokens on the ledger."));
            }

            getSubAccountByHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.subAccount))
            assetMetaDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.metadata))

            const transferToServiceHandler = new TransferToServiceHandler(logger,
                assetMetaDataHandler,
                identifierService,
                getSubAccountByHandler);

            const result = await transferToServiceHandler.handle(test.input);
            expect(result).toEqual(test.result);
        }, 10000);
    }

})