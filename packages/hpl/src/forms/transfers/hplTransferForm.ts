import { Amount } from "@ic-wallet-middleware/common";

export interface HplTransferForm {
    txFrom: ITransferModel;
    txTo: ITransferModel;
    amount: Amount;
    assetId: bigint;
}

export interface HplTransferResult {
}

export interface ITransferModel {
    readonly type: "sub" | "vir" | "mint";
    owner?: string;
    id: bigint;
}

export class AccountTransferModel implements ITransferModel {

    public get type(): "sub" {
        return "sub"
    }
    public id: bigint;
}

export class VirtualAccountTransferModel implements ITransferModel {

    public get type(): "vir" {
        return "vir"
    }
    public owner: string;
    public id: bigint;
}