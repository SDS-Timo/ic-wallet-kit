export class ConsoleValidationError extends Error {

    constructor(public fieldName: string, message: string) {
        super(message);
    }
}
