import { IcrcIndexCanister, IcrcTransactionWithId } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { PageInfo } from "@ic-wallet-kit/common";
import { IcrcIndexError } from "@icrc/errors/icrcIndexError";
import { SubAccountId } from "@icrc/types";

export class IndexWrapper {

    private constructor(private icrcIndexCanister: IcrcIndexCanister) {

    }

    static create(address: any) {
        const icrcLedgerCanister = IndexWrapper.getIcrcIndexCanister(address);
        return new IndexWrapper(icrcLedgerCanister);
    }

    public async getTransactions(principal: Principal, subAccountId: SubAccountId, pageInfo: PageInfo): Promise<IcrcTransactionWithId[]> {
        try {

            const startItem = this.getStartItem(pageInfo.nextPageKey);

            const result = await this.icrcIndexCanister.getTransactions({
                max_results: BigInt(pageInfo.take),
                start: startItem,
                account: {
                    owner: principal,
                    subaccount: subAccountId.toUint8Array()
                }
            });
            return result.transactions;
        }
        catch (e: any) {
            throw new IcrcIndexError("get.transactions", e.message);
        }

    }

    private getStartItem(nextPageKey?: string): bigint | undefined {
        return nextPageKey ? BigInt(nextPageKey) : undefined;
    }

    private static getIcrcIndexCanister(ledgerAddress: any): IcrcIndexCanister {

        try {
            const result = IcrcIndexCanister.create({
                canisterId: ledgerAddress,
            });

            return result;
        }
        catch (e: any) {
            if (e.message && e.message.toString().indexOf("Canister ID is required") > -1) {
                throw e;
            }

            throw e;
        }
    }
}
