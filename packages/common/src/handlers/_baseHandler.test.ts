import { ValidationError } from "@common/errors/validationError";
import { IFormError } from "@common/forms";
import { IInfo, LoadType } from "@common/handlers/baseCacheHandler";
import { BaseHandler } from "@common/handlers/baseHandler";
import { MockLogger } from "@common/logger/logger.test";

interface FakeInfo extends IInfo {
}

interface FakeResult {
}

class MockHandler extends BaseHandler<FakeInfo, FakeResult> {
    async validate(form: any) {
        if (!form.valid) {
            throw new ValidationError("validation.error", "field", "Invalid field");
        }
    }
    async process(form: any) {
        return { success: true };
    }
}

describe("BaseHandler Tests", () => {
    let logger;
    let handler: MockHandler;

    beforeEach(() => {
        logger = new MockLogger();
        handler = new MockHandler(logger);
    });

    it("BaseHandler:handle should return success result on valid input", async () => {
        const form = { valid: true, loadType: LoadType.Full };
        const result = await handler.handle(form);
        expect(result.isSuccess).toBe(true);
        expect(result.data).toEqual({ success: true });
    });

    it("BaseHandler:handle should return error result on validation error", async () => {
        const form = { valid: false, loadType: LoadType.Full };
        const result = await handler.handle(form);
        expect(result.isSuccess).toBe(false);
        expect(result.errors).toEqual([
            {
                localizationKey: "validation.error",
                fieldName: "field",
                message: "Invalid field"
            }
        ]);
    });

    it("BaseHandler:processInternalError should handle unexpected errors", async () => {
        const error = new Error("Unexpected error");
        const result = handler["processInternalError"](error);
        expect(result.isSuccess).toBe(false);
        expect(result.errors).toEqual([
            {
                message: "Unexpected error",
                fieldName: "",
                localizationKey: "default.error.message"
            }
        ]);
    });

    it("BaseHandler:processInternalError should handle processError with errors", async () => {
        const error: IFormError = { fieldName: "fieldName", localizationKey: "localizationKey", message: "message" };

        handler.processError = jest.fn().mockReturnValue([error]);

        const result = handler["processInternalError"](error);
        expect(result.isSuccess).toBe(false);
        expect(result.errors).toEqual([error]);
    });
});
