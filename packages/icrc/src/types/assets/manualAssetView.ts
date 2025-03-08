import { ManualAssetValidationResult } from "./manualAssetValidationResult";


export interface ManualAssetView {
    indexAddress: string; // index
    ledgerAddress: string; // Asset ID address, canisterId

    decimal?: number;
    name?: string;
    symbol?: string;
    transactionFee?: bigint;

    indexResult: ManualAssetValidationResult;
    contractResult: ManualAssetValidationResult;
}
