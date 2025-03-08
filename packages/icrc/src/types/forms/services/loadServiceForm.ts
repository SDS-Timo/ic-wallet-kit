import { ILoadForce } from "@ic-wallet-kit/common";

export interface LoadServiceAssetsForm extends ILoadForce {
    servicePrincipal: string;
    ledgerAddresses: string[];
}
