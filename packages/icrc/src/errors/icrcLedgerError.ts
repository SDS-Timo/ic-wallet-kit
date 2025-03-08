import { BadRequestError } from "@ic-wallet-middleware/common";

export class IcrcLegerError extends BadRequestError {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}

