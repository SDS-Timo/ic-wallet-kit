import { ILoadForce } from "@ic-wallet-middleware/common";

export interface LoadServiceAssetsForm extends ILoadForce {
    servicePrincipal: string;
    ledgerAddresses: string[];
}
