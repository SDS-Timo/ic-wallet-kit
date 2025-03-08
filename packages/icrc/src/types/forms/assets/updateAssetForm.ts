import { IFormBase } from "@ic-wallet-kit/common";


export interface UpdateAssetForm extends IFormBase {
    ledgerAddress: string;
    assetName: string;
    symbol: string;
    shortDecimal: number;
}
