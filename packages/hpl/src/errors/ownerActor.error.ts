
export class OwnerActorError extends Error {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}
