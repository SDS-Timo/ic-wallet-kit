import { itForeach } from "@hpl/__tests_utils/itForeach";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { AccountTransferModel } from "@hpl/forms/transfers/hplTransferForm";
import { TransferHandler } from "@hpl/handlers/transfer/transferHandler/transferHandler";
import { HplFtAssetCacheDataHandler } from "@hpl/internalHandlers";
import { LoadType, ValidationError } from "@ic-wallet-kit/common";
import { AggregatorDelegate, HPLClient } from "@research-ag/hpl-client";
import { of, throwError } from "rxjs";

describe("Unit TransferHandler tests", () => {
    const testData = [
        {
            name: "transfer error: Asset Not Found",
            input: {
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
            },
            data: {
                aggregator: new AggregatorDelegate("g2erz-sqaaa-aaaaj-qa2oa-cai", "ic"),
                ftAssetLastId: BigInt(6),
                ftAssets: [{
                    assetId: BigInt(5),
                    ftAssetInfo: {
                        decimals: 0
                    }
                }],
                pollTx: of({
                    status: "processed",
                    txId: [52n, 18n],
                    statusPayload: [{
                        success: {
                            ftTransfer: {
                                fee: 1n,
                                amount: 2n
                            }
                        }
                    }]
                })
            },
            result: {},
            error: new ValidationError(
                "asset.not.found",
                "assetId",
                "Asset Not Found"
            )
        },
        {
            name: "transfer error: Invalid amount",
            input: {
                txFrom: {
                    type: "sub",
                    id: BigInt(1)
                } as AccountTransferModel,
                txTo: {
                    type: "sub",
                    id: BigInt(3)
                } as AccountTransferModel,
                amount: "0",
                assetId: BigInt(5)
            },
            data: {
                aggregator: new AggregatorDelegate("g2erz-sqaaa-aaaaj-qa2oa-cai", "ic"),
                ftAssetLastId: BigInt(6),
                ftAssets: [{
                    assetId: BigInt(5),
                    ftAssetInfo: {
                        decimals: 0
                    }
                }],
                pollTx: of({
                    status: "processed",
                    txId: [52n, 18n],
                    statusPayload: [{
                        success: {
                            ftTransfer: {
                                fee: 1n,
                                amount: 2n
                            }
                        }
                    }]
                })
            },
            result: {},
            error: new ValidationError(
                "transaction.invalid.amount",
                "amount",
                "Invalid amount"
            )
        },
        {
            name: "transfer error, Insufficient funds",
            input: {
                txFrom: {
                    type: "sub",
                    id: BigInt(1)
                } as AccountTransferModel,
                txTo: {
                    type: "sub",
                    id: BigInt(3)
                } as AccountTransferModel,
                amount: "20",
                assetId: BigInt(5)
            },
            data: {
                aggregator: new AggregatorDelegate("g2erz-sqaaa-aaaaj-qa2oa-cai", "ic"),
                ftAssetLastId: BigInt(6),
                ftAssets: [{
                    assetId: BigInt(5),
                    ftAssetInfo: {
                        decimals: 0
                    }
                }],
                pollTx: of({
                    status: "processed",
                    txId: [52n, 18n],
                    statusPayload: [{
                        failure: {
                            ftTransfer: {
                                InsufficientFunds: null
                            }
                        }
                    }]
                })

            },
            result: {},
            error: new ValidationError(
                "insufficient.funds",
                "",
                "Insufficient funds"
            )
        },
        {
            name: "transfer error, Unknown subaccount",
            input: {
                txFrom: {
                    type: "sub",
                    id: BigInt(1)
                } as AccountTransferModel,
                txTo: {
                    type: "sub",
                    id: BigInt(3)
                } as AccountTransferModel,
                amount: "20",
                assetId: BigInt(5)
            },
            data: {
                aggregator: new AggregatorDelegate("g2erz-sqaaa-aaaaj-qa2oa-cai", "ic"),
                ftAssetLastId: BigInt(6),
                ftAssets: [{
                    assetId: BigInt(5),
                    ftAssetInfo: {
                        decimals: 0
                    }
                }],
                pollTx: of({
                    status: "processed",
                    txId: [52n, 18n],
                    statusPayload: [{
                        failure: {
                            ftTransfer: {
                                InvalidArguments: "Unknown subaccount"
                            }
                        }
                    }]
                })

            },
            result: {},
            error: new ValidationError(
                "simple.transfer.error",
                "",
                "{\"InvalidArguments\":\"Unknown subaccount\"}"
            )
        },
        {
            name: "transfer error, Insufficient funds",
            input: {
                txFrom: {
                    type: "sub",
                    id: BigInt(1)
                } as AccountTransferModel,
                txTo: {
                    type: "sub",
                    id: BigInt(3)
                } as AccountTransferModel,
                amount: "20",
                assetId: BigInt(5)
            },
            data: {
                aggregator: undefined,
                ftAssetLastId: BigInt(6),
                ftAssets: [{
                    assetId: BigInt(5),
                    ftAssetInfo: {
                        decimals: 0
                    }
                }],
                pollTx: of({
                })

            },
            result: {},
            error: new ValidationError(
                "could.not.pick.aggregator",
                "",
                "Could not pick aggregator"
            )
        },
        {
            name: "transfer from amount to amount success",
            input: {
                txFrom: {
                    type: "sub",
                    id: BigInt(1)
                } as AccountTransferModel,
                txTo: {
                    type: "sub",
                    id: BigInt(3)
                } as AccountTransferModel,
                amount: "4",
                assetId: BigInt(5)
            },
            data: {
                aggregator: new AggregatorDelegate("g2erz-sqaaa-aaaaj-qa2oa-cai", "ic"),
                ftAssetLastId: BigInt(6),
                ftAssets: [{
                    assetId: BigInt(5),
                    ftAssetInfo: {
                        decimals: 0
                    }
                }],
                pollTx: of({
                    status: "processed",
                    txId: [52n, 18n],
                    statusPayload: [{
                        success: {
                            ftTransfer: {
                                fee: 1n,
                                amount: 2n
                            }
                        }
                    }]
                })
            },
            result: {}
        },
        {
            name: "transfer error, HPLClient.pollTx",
            input: {
                txFrom: {
                    type: "sub",
                    id: BigInt(1)
                } as AccountTransferModel,
                txTo: {
                    type: "sub",
                    id: BigInt(3)
                } as AccountTransferModel,
                amount: "4",
                assetId: BigInt(5)
            },
            data: {
                aggregator: new AggregatorDelegate("g2erz-sqaaa-aaaaj-qa2oa-cai", "ic"),
                ftAssetLastId: BigInt(6),
                ftAssets: [{
                    assetId: BigInt(5),
                    ftAssetInfo: {
                        decimals: 0
                    }
                }],
                pollTx: undefined
            },
            result: {},
            error: new ValidationError(
                "simple.transfer.error",
                "",
                "Test Error"
            )
        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");
        HPLClient.prototype.setIdentity = jest.fn().mockResolvedValue(Promise.resolve({}));
        HPLClient.prototype.pickAggregator = jest.fn().mockResolvedValue(Promise.resolve(test.data.aggregator));
        HPLClient.prototype.simpleTransfer = jest.fn().mockResolvedValue(Promise.resolve([52n, 18n]));
        HPLClient.prototype.pollTx = jest.fn().mockImplementation(() => test.data.pollTx);
        if (!test.data.pollTx) {
            HPLClient.prototype.pollTx = jest.fn().mockReturnValue(throwError({
                status: 401,
                message: 'Test Error',
            }));
        }
        const hplFtAssetCacheDataHandler = new (<new () => HplFtAssetCacheDataHandler><unknown>HplFtAssetCacheDataHandler)() as jest.Mocked<HplFtAssetCacheDataHandler>;
        hplFtAssetCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data));
        const transferHandler = new TransferHandler(logger, identifierService, mockCanisterService, hplFtAssetCacheDataHandler);
        const result = await transferHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(hplFtAssetCacheDataHandler.process).toHaveBeenCalledWith({
            loadType: LoadType.Cache
        });
    });

})
