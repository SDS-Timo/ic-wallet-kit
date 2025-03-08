export class DictionaryActorError extends Error {
    constructor(public errorType: string, message: string) {
        super(message);
    }
}
