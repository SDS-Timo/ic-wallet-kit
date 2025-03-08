import { BadRequestError } from "@ic-wallet-middleware/common";

export class IcrcIndexError extends BadRequestError {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}
