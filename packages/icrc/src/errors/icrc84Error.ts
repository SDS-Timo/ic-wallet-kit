import { BadRequestError } from "@ic-wallet-middleware/common";

export class Icrc84Error extends BadRequestError {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}
