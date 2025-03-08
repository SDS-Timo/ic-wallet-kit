
export class HplMintActorError extends Error {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}
