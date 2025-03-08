export class RxDbRepositoryError extends Error {
    constructor(public errorType: string, message: string) {
        super(message);
    }
}