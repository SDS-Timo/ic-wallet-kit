import { IFormBase } from "@ic-wallet-kit/common";


export interface AddAssetForm extends IFormBase {
    indexAddress: string; // index
    ledgerAddress: string; // Asset ID, address, canisterId
    name: string;
    symbol: string;
    shortDecimal: number;
}
