import { Principal } from "@dfinity/principal";

export interface IHplClient {
    pickAggregator(): Promise<any | null>
    simpleTransfer(
        aggregator: any,
        from: TransferAccountReference,
        to: TransferAccountReference,
        asset: any,
        amount: number | BigInt | 'max',
        feeMode: any | null,
        memo: Array<Uint8Array | number[]>,
    ): Promise<any>
}

export type TransferAccountReference =
    | { type: 'sub'; id: bigint }
    | { type: 'vir'; owner: Principal | string; id: bigint }
    | { type: 'mint' };