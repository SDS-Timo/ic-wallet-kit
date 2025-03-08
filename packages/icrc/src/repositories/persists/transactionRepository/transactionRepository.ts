import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { SubAccount, TransactionWithId } from "@dfinity/ledger-icrc/dist/candid/icrc_index-ng";
import { Principal } from "@dfinity/principal";
import { IdentifierService, PageResultEmptyKey } from "@ic-wallet-kit/common";
import { TransactionsRepositoryError } from "@icrc/errors/transactionsRepositoryError";
import { SubAccountId } from "@icrc/types";
import { OperationStatusEnum, OperationTypeEnum, TransactionTypeEnum } from "@icrc/types/enums";
import { GetListTransactionResult } from "@icrc/types/transactions";
import { AssetTransactionInfo } from "@icrc/types/transactions/assetTransactionInfo";
import { Operation } from "@icrc/types/transactions/operation";
import { RosettaApiParam } from "@icrc/types/transactions/rosettaApiParam";
import { RosettaTransaction } from "@icrc/types/transactions/rosettaTransaction";
import { TransactionModel } from "@icrc/types/transactions/transactionModel";
import { IndexWrapper } from "@icrc/wrappers/icrc/indexWrapper/indexWrapper";
import { Service } from "typedi";

const milliPerSecond = 1000000;

@Service()
export class TransactionRepository {

    constructor(private identifierService: IdentifierService) { }

    public async getIcpListTransaction(asset: AssetTransactionInfo,
        param: RosettaApiParam): Promise<GetListTransactionResult> {

        const skip = asset.pageInfo.nextPageKey ? Number(asset.pageInfo.nextPageKey) : 0;

        if (Number.isNaN(skip)) {
            throw new TransactionsRepositoryError("get.icp.list.transaction.invalid.nextPageKey", "Invalid nextPageKey");
        }

        let result: TransactionModel[] = [];
        for (const subAccountId of asset.subAccountIds) {
            let subAccount = SubAccountNNS.fromBytes(subAccountId.toUint8Array()) as SubAccountNNS;

            const accountIdentifier = AccountIdentifier.fromPrincipal({
                principal: this.identifierService.getPrincipal(),
                subAccount: subAccount,
            });
            try {
                const response = await fetch(`${param.url}/search/transactions`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            network_identifier: {
                                blockchain: param.blockchain,
                                network: param.network,
                            },
                            account_identifier: {
                                address: accountIdentifier.toHex(),
                            },
                            offset: skip,
                            limit: asset.pageInfo.take
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "*/*",
                        },
                    }).catch();

                if (!response.ok) throw Error(`${response.statusText}`);

                const { transactions } = await response.json();
                const trans = transactions.map(({ transaction, block_identifier }: any) =>
                    this.formatIcpTransaction(accountIdentifier.toHex(), transaction, block_identifier.hash, param.canisterId)
                );

                result = result.concat(trans);

                if (result.length >= asset.pageInfo.take) {
                    result = result.slice(0, asset.pageInfo.take);
                    break;
                }
            }
            catch (e: any) {
                throw new TransactionsRepositoryError("get.icp.list.transaction.error", e.message);
            }
        }

        const hasNext = result.length == asset.pageInfo.take;

        let nextPageKey = PageResultEmptyKey;

        if (hasNext) {
            nextPageKey = (asset.pageInfo.take + skip).toString();
        }

        return {
            transactions: result,
            pageResult: {
                hasNext: hasNext,
                nextPageKey: nextPageKey
            }
        };
    }

    public async getIcrcListTransactionByAsset(asset: AssetTransactionInfo): Promise<GetListTransactionResult> {
        let result: TransactionModel[] = [];
        for (const subAccountId of asset.subAccountIds) {
            const indexWrapper = IndexWrapper.create(asset.indexAsset);
            const transactions = await indexWrapper.getTransactions(this.identifierService.getPrincipal(), subAccountId, asset.pageInfo);

            const tran = transactions.map((t) => this.formatCkBTCTransaction(t, asset.indexAsset, asset.symbol, subAccountId));
            result = result.concat(tran);

            if (result.length >= asset.pageInfo.take) {
                result = result.slice(0, asset.pageInfo.take);
                break;
            }
        };

        const hasNext = result.length == asset.pageInfo.take;

        let nextPageKey = PageResultEmptyKey;

        if (hasNext && asset.pageInfo.take > 0) {
            nextPageKey = result[result.length - 1].idx;
        }

        return {
            transactions: result,
            pageResult: {
                hasNext: hasNext,
                nextPageKey: nextPageKey
            }
        };
    }

    private formatIcpTransaction(accountId: string,
        rosettaTransaction: RosettaTransaction,
        blockHash: string,
        canisterId: string
    ): TransactionModel {

        const model = {
            status: OperationStatusEnum.COMPLETED,
            hash: rosettaTransaction.transaction_identifier.hash + "-" + blockHash,
            timestamp: Math.floor(rosettaTransaction.metadata.timestamp / milliPerSecond)
        } as TransactionModel;

        rosettaTransaction.operations.forEach((operation: Operation, i: number) => {
            const value = BigInt(operation.amount.value);
            const amount = value;
            if (operation.type === OperationTypeEnum.FEE) {
                model.fee = amount;
                return;
            }
            if (value > BigInt(0)) {
                model.to = operation.account.address;
            } else if (value < BigInt(0)) {
                model.from = operation.account.address;
            } else {
                if (i === 0) {
                    model.from = operation.account.address;
                }
                if (i === 1) {
                    model.to = operation.account.address;
                }
            }

            if (
                model.status === OperationStatusEnum.COMPLETED &&
                operation.status !== OperationStatusEnum.COMPLETED
            ) {
                model.status = operation.status;
            }

            model.type = model.to === accountId ? TransactionTypeEnum.RECEIVE : TransactionTypeEnum.SEND;
            model.amount = amount;
            model.canisterId = canisterId;
            model.idx = rosettaTransaction.metadata.block_height.toString();
            model.symbol = operation.amount.currency.symbol;
        });
        return model

    }

    private formatCkBTCTransaction(transactionWithId: TransactionWithId,
        canisterId: string,
        symbol: string,
        subAccountId: SubAccountId): TransactionModel {
        const transaction = transactionWithId.transaction;
        const model = {
            timestamp: Math.floor(Number(transaction.timestamp) / milliPerSecond),
            status: OperationStatusEnum.COMPLETED,
            type: TransactionTypeEnum.NONE,
            kind: transaction.kind
        } as TransactionModel;
        switch (transaction.kind) {
            case "mint":
                transaction.mint.forEach((item) => {
                    // Get Tx data from Mint record
                    const amount = item.amount;
                    this.setTransactionBaseField(model, transactionWithId, canisterId, symbol, amount);
                    model.to = (item.to.owner as Principal).toString();
                    model.toSub = this.getSubAccount(item.to.subaccount)

                    // Get AccountIdentifier of Receiver
                    model.identityTo = this.getAccountIdentifier(item.to.subaccount, item.to.owner)
                    model.type = TransactionTypeEnum.RECEIVE;
                });
                break;
            case "burn":
                transaction.burn.forEach((item) => {
                    // Get Tx data from Burn record
                    const amount = item.amount;
                    this.setTransactionBaseField(model, transactionWithId, canisterId, symbol, amount);
                    model.from = (item.from.owner as Principal).toString();
                    model.fromSub = this.getSubAccount(item.from.subaccount);

                    // Get AccountIdentifier of Sender
                    model.identityFrom = this.getAccountIdentifier(item.from.subaccount, item.from.owner);
                    model.type = TransactionTypeEnum.SEND;
                })
                break;
            default:
                transaction.transfer.forEach((item) => {
                    // Get Tx data from transfer record
                    const amount = item.amount;
                    this.setTransactionBaseField(model, transactionWithId, canisterId, symbol, amount);

                    model.to = (item.to.owner as Principal).toString();
                    model.toSub = this.getSubAccount(item.to.subaccount);

                    model.from = (item.from.owner as Principal).toString();
                    model.fromSub = this.getSubAccount(item.from.subaccount);

                    const subCheck = subAccountId;
                    if (model.from === this.identifierService.getPrincipalStr()
                        && model.fromSub.equals(subCheck)) {
                        model.type = TransactionTypeEnum.SEND;
                    } else {
                        model.type = TransactionTypeEnum.RECEIVE;
                    }
                    // Get AccountIdentifier of Receiver
                    model.identityTo = this.getAccountIdentifier(item.to.subaccount, item.to.owner)

                    // Get AccountIdentifier of Sender
                    model.identityFrom = this.getAccountIdentifier(item.from.subaccount, item.from.owner);
                })
                break;
        }
        return model;
    }

    private getAccountIdentifier(subAccount: [] | [SubAccount], owner: Principal): string {
        let subAcc: SubAccountNNS | undefined = undefined;
        try {
            subAcc = SubAccountNNS.fromBytes((subAccount as [Uint8Array])[0]) as SubAccountNNS;
        } catch {
            subAcc = undefined;
        }
        const identity = AccountIdentifier.fromPrincipal({
            principal: owner as Principal,
            subAccount: subAcc,
        }).toHex();
        return identity
    }

    private getSubAccount(subaccount: [] | [SubAccount]): SubAccountId {

        return subaccount.length > 0
            ? SubAccountId.parseFromUint8Array(subaccount[0] as Uint8Array)
            : SubAccountId.parseFromString("0x0");
    }

    private setTransactionBaseField(model: TransactionModel,
        transactionWithId: TransactionWithId,
        canisterId: string,
        symbol: string,
        amount: bigint) {
        model.canisterId = canisterId;
        model.symbol = symbol;
        model.amount = amount;
        model.idx = transactionWithId.id.toString();
    }
}