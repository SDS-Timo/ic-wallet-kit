import { IFormBase, ILoadForce } from "@ic-wallet-middleware/common";

export interface InternalHandlerForm extends IFormBase, ILoadForce {
    ledgerAddress: string; // address, canisterId,
}
