import { IcrcSubAccount } from "./icrcSubAccount";


export interface IcrcAsset {
    ledgerAddress: string; // address, canisterId
    indexAddress: string;
    decimal: number;
    logo: string | undefined;
    name: string; //tokenName assetName
    symbol: string; //tokenSymbol, assetSymbol
    fee: string | undefined;
    transactionFee: bigint;
    subAccounts: IcrcSubAccount[];
    isSync: boolean;
}
