
export class IngressActorError extends Error {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}
