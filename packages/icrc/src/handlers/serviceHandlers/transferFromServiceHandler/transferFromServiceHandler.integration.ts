import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { TransferFromServiceHandler } from "@icrc/handlers/serviceHandlers/transferFromServiceHandler/transferFromServiceHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { ServiceAssetDetailsHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDetailsHandler/serviceAssetDetailsHandler";
import { SubAccountId } from "@icrc/types";

describe("Unit ServiceAssetCacheCreditHandler tests", () => {
    const testData = [
        {
            name: "transfer",
            input: {
                amount: "0.0002",
                fromPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                toPrincipal: "3etep-celzb-5t4iw-swa7s-3yek6-g45iq-cuopt-6t3lp-phfdf-xh7va-gqe",
                toSubId: SubAccountId.parseFromString("0x1")
            },
            data: {
                details: {
                    assetDetail: {
                        allowanceFee: BigInt(1000),
                        withdrawalFee: BigInt(1000),
                        depositFee: BigInt(1000),
                    }
                },
                credit: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    credit: BigInt(1000000)
                },
                debit: {
                    serviceAssetDeposit: BigInt(0)
                },
                metadata: {
                    symbol: "ICP",
                    name: "Internet Computer",
                    decimals: 8,
                    logo: "",
                    fee: BigInt(10000),
                }
            },
            result: FormResult.error([{
                fieldName: "",
                localizationKey: "default.error.message",
                message: "Insufficient Credit"
            }])
        },
        {
            name: "error, Amount should be more that withdrawal fee",
            input: {
                amount: "0.0001",
                fromPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                toPrincipal: "3etep-celzb-5t4iw-swa7s-3yek6-g45iq-cuopt-6t3lp-phfdf-xh7va-gqe",
                toSubId: SubAccountId.parseFromString("0x1")
            },
            data: {
                details: {
                    assetDetail: {
                        allowanceFee: BigInt(10000),
                        withdrawalFee: BigInt(10000),
                        depositFee: BigInt(10000),
                    }
                },
                credit: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    credit: BigInt(1000000)
                },
                debit: {
                    serviceAssetDeposit: BigInt(0)
                },
                metadata: {
                    symbol: "ICP",
                    name: "Internet Computer",
                    decimals: 8,
                    logo: "",
                    fee: BigInt(10000),
                }
            },
            result: FormResult.error([{
                fieldName: "amount",
                localizationKey: "transfer.amount.less.minimum.withdrawal",
                message: "Amount should be more that withdrawal fee: 10000"
            }])
        },
        {
            name: "error, Amount should be more that 0",
            input: {
                amount: "0",
                fromPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                toPrincipal: "3etep-celzb-5t4iw-swa7s-3yek6-g45iq-cuopt-6t3lp-phfdf-xh7va-gqe",
                toSubId: SubAccountId.parseFromString("0x1")
            },
            data: {
                details: {
                    assetDetail: {
                        allowanceFee: BigInt(10000),
                        withdrawalFee: BigInt(10000),
                        depositFee: BigInt(10000),
                    }
                },
                credit: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    credit: BigInt(10000)
                },
                debit: {
                    serviceAssetDeposit: BigInt(10000)
                },
                metadata: {
                    symbol: "ICP",
                    name: "Internet Computer",
                    decimals: 8,
                    logo: "",
                    fee: BigInt(10000),
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
                fromPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                toPrincipal: "3etep-celzb-5t4iw-swa7s-3yek6-g45iq-cuopt-6t3lp-phfdf-xh7va-gqe",
                toSubId: SubAccountId.parseFromString("0x1")
            },
            data: {
                details: {
                    assetDetail: {
                        allowanceFee: BigInt(10000),
                        withdrawalFee: BigInt(10000),
                        depositFee: BigInt(10000),
                    }
                },
                credit: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    credit: BigInt(10000)
                },
                debit: {
                    serviceAssetDeposit: BigInt(10000)
                },
                metadata: {
                    symbol: "ICP",
                    name: "Internet Computer",
                    decimals: 8,
                    logo: "",
                    fee: BigInt(10000),
                },
            },
            result: FormResult.error([{
                fieldName: "amount",
                localizationKey: "transfer.from.no.enough.balance",
                message: "Sent amount should be less than balance",
            }])
        },
        {
            name: "error, Sent amount should be less than balance ",
            input: {
                amount: "0.0002",
                fromPrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                toPrincipal: "3etep-celzb-5t4iw-swa7s-3yek6-g45iq-cuopt-6t3lp-phfdf-xh7va-gqe",
                toSubId: SubAccountId.parseFromString("0x1")
            },
            data: {
                details: {
                    assetDetail: {
                        allowanceFee: BigInt(10000),
                        withdrawalFee: BigInt(10000),
                        depositFee: BigInt(10000),
                    }
                },
                credit: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    credit: BigInt(10000)
                },
                debit: {
                    serviceAssetDeposit: BigInt(10000)
                },
                metadata: undefined,
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
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
            assetMetaDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.metadata))
            const serviceAssetDetailsHandler = new (<new () => ServiceAssetDetailsHandler><unknown>ServiceAssetDetailsHandler)() as jest.Mocked<ServiceAssetDetailsHandler>;
            serviceAssetDetailsHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.details))
            const serviceAssetCreditHandler = new (<new () => ServiceAssetCacheCreditHandler><unknown>ServiceAssetCacheCreditHandler)() as jest.Mocked<ServiceAssetCacheCreditHandler>;
            serviceAssetCreditHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.credit))
            const serviceAssetDepositHandler = new (<new () => ServiceAssetDepositHandler><unknown>ServiceAssetDepositHandler)() as jest.Mocked<ServiceAssetDepositHandler>;
            serviceAssetDepositHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.debit))
            const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;
            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))
            const logger = new MockLogger();
            const transferFromServiceHandler = new TransferFromServiceHandler(logger,
                assetMetaDataHandler,
                serviceAssetDetailsHandler,
                serviceAssetCreditHandler,
                serviceAssetDepositHandler,
                identifierService,
                subAccountBalanceHandler);
            const result = await transferFromServiceHandler.handle(test.input);
            expect(result).toEqual(test.result);
        }, 100000);
    }

})