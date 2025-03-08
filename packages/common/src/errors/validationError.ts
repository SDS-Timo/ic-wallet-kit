export class ValidationError extends Error {
    
    constructor(public localizationKey: string, public fieldName: string, message: string) {
        super(message);
    }
}
