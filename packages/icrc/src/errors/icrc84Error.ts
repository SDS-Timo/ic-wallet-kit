import { BadRequestError } from "@ic-wallet-kit/common";

export class Icrc84Error extends BadRequestError {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}
