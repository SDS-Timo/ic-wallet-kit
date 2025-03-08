export class CacheDataError extends Error {

    constructor(public errorType: string, message: string) {
        super(message);
    }
}

