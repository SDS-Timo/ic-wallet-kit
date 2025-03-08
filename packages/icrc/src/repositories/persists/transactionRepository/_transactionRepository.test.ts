
import { AccountIdentifier, SubAccount } from "@dfinity/ledger-icp";
import { IcrcTransactionWithId } from "@dfinity/ledger-icrc";
import { TransactionWithId } from "@dfinity/ledger-icrc/dist/candid/icrc_index-ng";
import { Principal } from "@dfinity/principal";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { TransactionsRepositoryError } from "@icrc/errors";
import { TransactionRepository } from "@icrc/repositories/persists/transactionRepository/transactionRepository";
import { AssetTransactionInfo, OperationStatusEnum, OperationTypeEnum, RosettaApiParam, RosettaTransaction, SubAccountId, TransactionModel, TransactionTypeEnum } from "@icrc/types";
import { IndexWrapper } from "@icrc/wrappers";


describe("TransactionRepository", () => {
    let transactionRepository: TransactionRepository;
    let mockIdentifierService = mockAnonymousIdentifierService();

    beforeEach(() => {
        mockIdentifierService = mockAnonymousIdentifierService();
        transactionRepository = new TransactionRepository(mockIdentifierService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("TransactionRepository:getIcpListTransaction should throw error on invalid nextPageKey", async () => {
        const asset: AssetTransactionInfo = {
            indexAsset: "",
            subAccountIds: [SubAccountId.Default()],
            symbol: "ICP",
            pageInfo: {
                nextPageKey: "invalid",
                take: 10
            }
        };
        const param: RosettaApiParam = {
            blockchain: "",
            canisterId: "",
            network: "",
            url: ""
        };
        await expect(transactionRepository.getIcpListTransaction(asset, param)).rejects.toThrow(TransactionsRepositoryError);
    });

    it("TransactionRepository:getIcpListTransaction should throw error on invalid global.fetch", async () => {
        const asset: AssetTransactionInfo = {
            indexAsset: "",
            subAccountIds: [SubAccountId.Default()],
            symbol: "ICP",
            pageInfo: {
                nextPageKey: "0",
                take: 10
            }
        };
        const param: RosettaApiParam = {
            blockchain: "",
            canisterId: "",
            network: "",
            url: ""
        };

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            statusText: "fetch error message"
        });


        const error = new TransactionsRepositoryError("get.icp.list.transaction.error", "fetch error message");

        await expect(transactionRepository.getIcpListTransaction(asset, param)).rejects.toThrow(error);
    });

    it("TransactionRepository:getIcpListTransaction should return transactions", async () => {
        const asset = {
            indexAsset: "",
            subAccountIds: [SubAccountId.Default()],
            symbol: "ICP",
            pageInfo: { take: 2 }
        };
        const param: RosettaApiParam = {
            blockchain: "",
            canisterId: "",
            network: "",
            url: ""
        };

        const transaction: RosettaTransaction = {
            transaction_identifier: { hash: "tx-hash" },
            metadata: { timestamp: 1700000000000, block_height: 100, lockTime: 10, memo: 3 },
            operations: [{
                type: OperationTypeEnum.TRANSACTION,
                amount: {
                    value: "1000", decimals: 8, currency: { symbol: "ICP" }
                },
                account: { address: "from-addr" },
                status: OperationStatusEnum.COMPLETED,
                operation_identifier: { index: 12312 }
            }]
        };

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                transactions: [
                    {
                        transaction: transaction,
                        block_identifier: { hash: "xxxxx" }
                    },
                    {
                        transaction: transaction,
                        block_identifier: { hash: "xxxxx" }
                    },
                    {
                        transaction: transaction,
                        block_identifier: { hash: "xxxxx" }
                    }
                ]
            })
        });

        const transactionResult = {
            amount: 1000n,
            canisterId: "",
            hash: "tx-hash-xxxxx",
            idx: "100",
            status: "COMPLETED",
            symbol: "ICP",
            timestamp: 1700000,
            to: "from-addr",
            type: "SEND",
        };

        const result = await transactionRepository.getIcpListTransaction(asset, param);
        expect(result.transactions).toEqual([transactionResult, transactionResult]);
        expect(result.pageResult.hasNext).toBe(true);
    });

    it("TransactionRepository:getIcrcListTransactionByAsset should return transactions", async () => {
        const mockIndexWrapper = {
            getTransactions: jest.fn().mockResolvedValue([]),
        };

        IndexWrapper.create = jest.fn().mockReturnValue(mockIndexWrapper);

        const asset = {
            indexAsset: "",
            subAccountIds: [SubAccountId.Default()],
            symbol: "ICP",
            pageInfo: { take: 2 }
        };

        const transaction: IcrcTransactionWithId[] =
            [
                {
                    id: 1000n,
                    transaction: {
                        burn: [],
                        kind: "kind_1",
                        mint: [
                            {
                                amount: 1212n,
                                created_at_time: [],
                                memo: [],
                                to:
                                {
                                    owner: Principal.anonymous(),
                                    subaccount: []
                                }
                            }
                        ],
                        approve: [],
                        timestamp: 1000023402304n,
                        transfer: []
                    }
                },
                {
                    id: 1000n,
                    transaction: {
                        burn: [],
                        kind: "kind_1",
                        mint: [],
                        approve: [],
                        timestamp: 1000023402304n,
                        transfer: []
                    }
                },
                {
                    id: 1000n,
                    transaction: {
                        burn: [],
                        kind: "kind_1",
                        mint: [],
                        approve: [],
                        timestamp: 1000023402304n,
                        transfer: []
                    }
                }
            ]

        mockIndexWrapper.getTransactions.mockResolvedValue(transaction);

        const transactionResult = {
            kind: "kind_1",
            status: "COMPLETED",
            timestamp: 1000023,
            type: "NONE",
        }

        const result = await transactionRepository.getIcrcListTransactionByAsset(asset);

        expect(result.transactions).toEqual([transactionResult, transactionResult]);
        expect(result.pageResult).toEqual({ hasNext: true, nextPageKey: undefined });
    });

    it("TransactionRepository:formatIcpTransaction should format transaction correctly", () => {
        const transaction: RosettaTransaction = {
            transaction_identifier: { hash: "tx-hash" },
            metadata: { timestamp: 1700000000000, block_height: 100, lockTime: 10, memo: 3 },
            operations: [{
                type: OperationTypeEnum.TRANSACTION,
                amount: {
                    value: "1000", decimals: 8, currency: { symbol: "ICP" }
                },
                account: { address: "from-addr" },
                status: OperationStatusEnum.COMPLETED,
                operation_identifier: { index: 12312 }
            }]
        };


        const formatted = transactionRepository["formatIcpTransaction"]("mock-account", transaction, "block-hash", "canister-id");
        expect(formatted.hash).toBe("tx-hash-block-hash");
        expect(formatted.amount).toBe(BigInt(1000));
        expect(formatted.status).toBe(OperationStatusEnum.COMPLETED);
    });

    it("TransactionRepository:formatCkBTCTransaction should format transaction correctly with mint", () => {
        const transactionWithId: TransactionWithId = {
            id: 10n,
            transaction: {
                timestamp: BigInt(1700000000000),
                kind: "mint",
                mint: [{
                    amount: BigInt(500),
                    to: { owner: Principal.anonymous(), subaccount: [] },
                    created_at_time: [234123123n],
                    memo: []
                }],
                approve: [],
                burn: [],
                transfer: []
            }
        };

        const formatted = transactionRepository["formatCkBTCTransaction"](transactionWithId, "canister-id", "BTC", SubAccountId.Default());

        expect(formatted).toEqual({
            timestamp: 1700000,
            status: "COMPLETED",
            type: "RECEIVE",
            kind: "mint",
            canisterId: "canister-id",
            symbol: "BTC",
            amount: 500n,
            idx: "10",
            to: "2vxsx-fae",
            toSub: SubAccountId.Default(),
            identityTo: "1c7a48ba6a562aa9eaa2481a9049cdf0433b9738c992d698c31d8abf89cadc79"
        });

    });

    it("TransactionRepository:formatCkBTCTransaction should format transaction correctly with burn", () => {
        const transactionWithId: TransactionWithId = {
            id: 10n,
            transaction: {
                timestamp: BigInt(1700000000000),
                kind: "burn",
                mint: [],
                approve: [],
                burn: [{
                    amount: BigInt(500),
                    from: { owner: Principal.anonymous(), subaccount: [] },
                    created_at_time: [234123123n],
                    memo: [],
                    spender: []
                }],
                transfer: []
            }
        };

        const formatted = transactionRepository["formatCkBTCTransaction"](transactionWithId, "canister-id", "BTC", SubAccountId.Default());

        expect(formatted).toEqual({
            timestamp: 1700000,
            status: "COMPLETED",
            type: "SEND",
            kind: "burn",
            canisterId: "canister-id",
            symbol: "BTC",
            amount: 500n,
            idx: "10",
            from: "2vxsx-fae",
            fromSub: SubAccountId.Default(),
            identityFrom: "1c7a48ba6a562aa9eaa2481a9049cdf0433b9738c992d698c31d8abf89cadc79"
        });
    });

    it("TransactionRepository:formatCkBTCTransaction should format transaction correctly with transfer RECEIVE", () => {
        const transactionWithId: TransactionWithId = {
            id: 10n,
            transaction: {
                timestamp: BigInt(1700000000000),
                kind: "transfer",
                mint: [],
                approve: [],
                burn: [],
                transfer: [{
                    amount: BigInt(300),
                    from: { owner: Principal.anonymous(), subaccount: [] },
                    created_at_time: [12341234112n],
                    memo: [],
                    spender: [],
                    fee: [],
                    to: {
                        owner: Principal.anonymous(), subaccount: []
                    }
                }]
            }
        };

        const formatted = transactionRepository["formatCkBTCTransaction"](transactionWithId, "canister-id", "BTC", SubAccountId.parseFromString("0x3"));

        expect(formatted).toEqual({
            amount: 300n,
            canisterId: "canister-id",
            from: "2vxsx-fae",
            fromSub: SubAccountId.Default(),
            identityFrom: "1c7a48ba6a562aa9eaa2481a9049cdf0433b9738c992d698c31d8abf89cadc79",
            identityTo: "1c7a48ba6a562aa9eaa2481a9049cdf0433b9738c992d698c31d8abf89cadc79",
            idx: "10",
            kind: "transfer",
            status: "COMPLETED",
            symbol: "BTC",
            timestamp: 1700000,
            to: "2vxsx-fae",
            toSub: SubAccountId.Default(),
            type: "RECEIVE",
        });
    });

    it("TransactionRepository:formatCkBTCTransaction should format transaction correctly with transfer SEND", () => {


        const transactionWithId: TransactionWithId = {
            id: 10n,
            transaction: {
                timestamp: BigInt(1700000000000),
                kind: "transfer",
                mint: [],
                approve: [],
                burn: [],
                transfer: [{
                    amount: BigInt(300),
                    from: { owner: Principal.anonymous(), subaccount: [] },
                    created_at_time: [12341234112n],
                    memo: [],
                    spender: [],
                    fee: [],
                    to: {
                        owner: Principal.anonymous(), subaccount: []
                    }
                }]
            }
        };

        const formatted = transactionRepository["formatCkBTCTransaction"](transactionWithId, "canister-id", "BTC", SubAccountId.Default());

        expect(formatted).toEqual({
            amount: 300n,
            canisterId: "canister-id",
            from: "2vxsx-fae",
            fromSub: SubAccountId.Default(),
            identityFrom: "1c7a48ba6a562aa9eaa2481a9049cdf0433b9738c992d698c31d8abf89cadc79",
            identityTo: "1c7a48ba6a562aa9eaa2481a9049cdf0433b9738c992d698c31d8abf89cadc79",
            idx: "10",
            kind: "transfer",
            status: "COMPLETED",
            symbol: "BTC",
            timestamp: 1700000,
            to: "2vxsx-fae",
            toSub: SubAccountId.Default(),
            type: "SEND",
        });
    });


    it("TransactionRepository: formatIcpTransaction should correctly format ICP transaction SEND", () => {
        const accountId = "mock-account-id";
        const rosettaTransaction: RosettaTransaction = {
            transaction_identifier: { hash: "mock-hash" },
            metadata: { timestamp: 1700000000000000, block_height: 100, lockTime: 10, memo: 3 },
            operations: [
                {
                    account: { address: "from-address" },
                    amount: { value: "0", decimals: 8, currency: { symbol: "ICP" } },
                    type: OperationTypeEnum.TRANSACTION,
                    status: OperationStatusEnum.COMPLETED,
                    operation_identifier: { index: 12312 }
                },
                {
                    account: { address: "from-address" },
                    amount: { value: "0", decimals: 8, currency: { symbol: "ICP" } },
                    type: OperationTypeEnum.TRANSACTION,
                    status: OperationStatusEnum.PENDING,
                    operation_identifier: { index: 2354234523 }
                },
                {
                    account: { address: "from-address" },
                    amount: { value: "-100", decimals: 8, currency: { symbol: "ICP" } },
                    type: OperationTypeEnum.TRANSACTION,
                    status: OperationStatusEnum.COMPLETED,
                    operation_identifier: { index: 12312 }
                },
                {
                    account: { address: "to-address" },
                    amount: { value: "100", decimals: 8, currency: { symbol: "ICP" } },
                    type: OperationTypeEnum.TRANSACTION,
                    status: OperationStatusEnum.COMPLETED,
                    operation_identifier: { index: 2354234523 }
                },
                {
                    account: { address: "from-address" },
                    amount: { value: "100", decimals: 8, currency: { symbol: "ICP" } },
                    type: OperationTypeEnum.FEE,
                    status: OperationStatusEnum.COMPLETED,
                    operation_identifier: { index: 2354234523 }
                }
            ]
        };
        const blockHash = "mock-block-hash";
        const canisterId = "mock-canister-id";

        const result = transactionRepository["formatIcpTransaction"](accountId, rosettaTransaction, blockHash, canisterId);

        expect(result).toEqual({
            amount: 100n,
            canisterId: "mock-canister-id",
            fee: 100n,
            from: "from-address",
            hash: "mock-hash-mock-block-hash",
            idx: "100",
            status: "PENDING",
            symbol: "ICP",
            timestamp: 1700000000,
            to: "to-address",
            type: "SEND"
        });
    });


    it("TransactionRepository: formatIcpTransaction should correctly format ICP transaction RECEIVE", () => {
        const accountId = "to-address";
        const rosettaTransaction: RosettaTransaction = {
            transaction_identifier: { hash: "mock-hash" },
            metadata: { timestamp: 1700000000000000, block_height: 100, lockTime: 10, memo: 3 },
            operations: [
                {
                    account: { address: "to-address" },
                    amount: { value: "100", decimals: 8, currency: { symbol: "ICP" } },
                    type: OperationTypeEnum.TRANSACTION,
                    status: OperationStatusEnum.COMPLETED,
                    operation_identifier: { index: 2354234523 }
                }
            ]
        };
        const blockHash = "mock-block-hash";
        const canisterId = "mock-canister-id";

        const result = transactionRepository["formatIcpTransaction"](accountId, rosettaTransaction, blockHash, canisterId);

        expect(result).toEqual({
            amount: 100n,
            canisterId: "mock-canister-id",
            hash: "mock-hash-mock-block-hash",
            idx: "100",
            status: "COMPLETED",
            symbol: "ICP",
            timestamp: 1700000000,
            to: "to-address",
            type: TransactionTypeEnum.RECEIVE
        });
    });

    it("TransactionRepository: getAccountIdentifier should return correct account identifier", () => {
        const principal = Principal.fromText("aaaaa-aa");
        const subAccount = SubAccountId.parseFromString("0x0").toUint8Array();


        const result = transactionRepository["getAccountIdentifier"]([subAccount], principal);

        expect(result).toEqual(AccountIdentifier.fromPrincipal({ principal, subAccount: SubAccount.fromBytes(subAccount) as SubAccount }).toHex());
    });

    it("TransactionRepository: getSubAccount should return correct subaccount ID", () => {
        const subAccount = SubAccountId.parseFromString("0x0").toUint8Array();

        const result = transactionRepository["getSubAccount"]([subAccount]);

        expect(result.toUint8Array()).toEqual(subAccount);
    });

    it("TransactionRepository: setTransactionBaseField should correctly populate transaction model", () => {
        const model: TransactionModel = {
            amount: 10n,
            canisterId: mockLedgerAddress,
            fee: 10n,
            from: "",
            fromSub: SubAccountId.Default(),
            hash: "zzzz",
            identityFrom: "",
            identityTo: "",
            idx: "",
            kind: "",
            status: OperationStatusEnum.COMPLETED,
            symbol: "",
            timestamp: 123523452345,
            to: "",
            toSub: SubAccountId.Default(),
            type: TransactionTypeEnum.RECEIVE
        };
        const transactionWithId = { id: BigInt(1234) } as TransactionWithId;
        const canisterId = "mock-canister-id";
        const symbol = "ICP";
        const amount = BigInt(500);

        transactionRepository["setTransactionBaseField"](model, transactionWithId, canisterId, symbol, amount);

        expect(model).toEqual({
            ...model,
            canisterId: "mock-canister-id",
            symbol: "ICP",
            amount: BigInt(500),
            idx: "1234"
        });
    });
});
