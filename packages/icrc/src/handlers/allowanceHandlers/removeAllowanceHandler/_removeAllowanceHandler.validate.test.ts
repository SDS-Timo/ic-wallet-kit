import { ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { itValidate } from "@icrc/__tests_utils/itValidate";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { RemoveAllowanceHandler } from "@icrc/handlers/allowanceHandlers/removeAllowanceHandler/removeAllowanceHandler";

import { AllowanceLocalCache, AllowanceRepository } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit RemoveAllowanceHandler validate tests", () => {
    const valid = {
        ledgerAddress: "test-ledger-address",
        spenderPrincipal: "test-spender-principal",
        subAccountId: SubAccountId.Default(),
        spenderSubId: SubAccountId.Default()
    };

    const tests = {
        name: "remove allowance validation tests",
        tests: [
            {
                name: "Validation Error: Field ledgerAddress is required",
                input: {
                    key: getPropertyName(valid, v => v.ledgerAddress),
                    value: "",
                },
                error: new ValidationError(
                    "remove.allowance.ledgerAddress.is.required",
                    "ledgerAddress",
                    "Field ledgerAddress is required"
                ),
            },
            {
                name: "Validation Error: Field spenderPrincipal is required",
                input: {
                    key: getPropertyName(valid, v => v.spenderPrincipal),
                    value: "",
                },
                error: new ValidationError(
                    "remove.allowance.spender.is.required",
                    "spenderPrincipal",
                    "Field spenderPrincipal is required"
                ),
            },
            {
                name: "Validation Error: Field subAccountId is required",
                input: {
                    key: getPropertyName(valid, v => v.subAccountId),
                    value: "",
                },
                error: new ValidationError(
                    "remove.allowance.subAccountId.is.required",
                    "subAccountId",
                    "Field subAccountId is required"
                ),
            },
            {
                name: "Validation Error: Field spenderSubId is required",
                input: {
                    key: getPropertyName(valid, v => v.spenderSubId),
                    value: "",
                },
                error: new ValidationError("removing.allowance.spenderSubId.is.required",
                    "spenderSubId",
                    "Field spenderSubId is required"
                ),
            }
        ],
    };

    itValidate(valid, {}, tests, async (input) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const allowanceRepository = new (<new () => AllowanceRepository><unknown>AllowanceRepository)() as jest.Mocked<AllowanceRepository>;
        const allowanceLocalCache = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;

        allowanceRepository.removeAllowance = jest.fn().mockResolvedValue(Promise.resolve());
        allowanceLocalCache.removeAllowance = jest.fn().mockResolvedValue(Promise.resolve());
        LedgerWrapper.approveAllowance = jest.fn().mockResolvedValue(Promise.resolve());

        const removeAllowanceHandler = new RemoveAllowanceHandler(
            logger,
            identifierService,
            allowanceLocalCache,
            allowanceRepository
        );

        await removeAllowanceHandler.validate(input);
    });
});
