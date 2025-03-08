import { BadRequestError } from "@ic-wallet-kit/common";

export class IcrcIndexError extends BadRequestError {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}
