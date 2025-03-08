import { IFormBase } from "@ic-wallet-middleware/common";


export interface UpdateAssetForm extends IFormBase {
    ledgerAddress: string;
    assetName: string;
    symbol: string;
    shortDecimal: number;
}
