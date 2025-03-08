import { IFormBase, ILoadForce } from "@ic-wallet-kit/common";

export interface InternalHandlerForm extends IFormBase, ILoadForce {
    ledgerAddress: string; // address, canisterId,
}
