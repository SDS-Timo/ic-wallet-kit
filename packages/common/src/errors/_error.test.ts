import { BadRequestError } from "@common/errors/badRequestError";
import { CacheDataError } from "@common/errors/cacheDataError";
import { DbContextError } from "@common/errors/dbContextError";
import { RxDbRepositoryError } from "@common/errors/rxDbRepositoryError";
import { ValidationError } from "@common/errors/validationError";


describe("BadRequestError", () => {
    it("should create an error instance with the correct message", () => {
        const errorMessage = "Invalid request data";
        const error = new BadRequestError(errorMessage);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe(errorMessage);
    });
});



describe("CacheDataError", () => {
    it("should create an instance with errorType and message", () => {
        const errorType = "TestErrorType";
        const message = "This is a test error message";

        const error = new CacheDataError(errorType, message);

        expect(error).toBeInstanceOf(CacheDataError);
        expect(error.errorType).toBe(errorType);
        expect(error.message).toBe(message);
        expect(error).toBeInstanceOf(Error);
        expect(error.stack).toBeDefined();
    });
});


describe("DbContextError", () => {
    it("should create an instance with errorType and message", () => {
        const errorType = "TestErrorType";
        const message = "This is a test error message";

        const error = new DbContextError(errorType, message);

        expect(error).toBeInstanceOf(DbContextError);
        expect(error.errorType).toBe(errorType);
        expect(error.message).toBe(message);
        expect(error).toBeInstanceOf(Error);
        expect(error.stack).toBeDefined();
    });
});

describe("RxDbRepositoryError", () => {
    it("should create an instance with errorType and message", () => {
        const errorType = "TestErrorType";
        const message = "This is a test error message";

        const error = new RxDbRepositoryError(errorType, message);

        expect(error).toBeInstanceOf(RxDbRepositoryError);
        expect(error.errorType).toBe(errorType);
        expect(error.message).toBe(message);
        expect(error).toBeInstanceOf(Error);
        expect(error.stack).toBeDefined();
    });
});

describe("ValidationError", () => {
    it("should create an instance with errorType and message", () => {

        const localizationKey = "TetsLocalizationKey";
        const fieldName = "TestFieldName";
        const message = "This is a test error message";

        const error = new ValidationError(localizationKey, fieldName, message);

        expect(error).toBeInstanceOf(ValidationError);
        expect(error.localizationKey).toBe(localizationKey);
        expect(error.fieldName).toBe(fieldName);
        expect(error.message).toBe(message);
        expect(error).toBeInstanceOf(Error);
        expect(error.stack).toBeDefined();
    });
});
