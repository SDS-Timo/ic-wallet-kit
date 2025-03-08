import { IFormBase } from "@ic-wallet-kit/common";

export interface AddServiceAssetForm extends IFormBase {
    ledgerAddress: string;
    decimal: number;
    shortDecimal: number;
    tokenName: string;
    tokenSymbol: string;
    logo: string | undefined;
}
