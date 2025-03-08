export class TransactionsRepositoryError extends Error {
    constructor(public errorType: string, message: string) {
        super(message);
    }
}