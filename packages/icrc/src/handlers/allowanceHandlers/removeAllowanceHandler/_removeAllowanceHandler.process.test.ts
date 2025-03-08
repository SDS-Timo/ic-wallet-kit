import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { RemoveAllowanceHandler } from "@icrc/handlers/allowanceHandlers/removeAllowanceHandler/removeAllowanceHandler";

import { AllowanceLocalCache, AllowanceRepository } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit RemoveAllowanceHandler validate tests", () => {

    const tests = [
        {
            name: "Validation Error: Field ledgerAddress is required",
            input: {
                ledgerAddress: "test-ledger-address",
                spenderPrincipal: mockSpenderPrincipalString(),
                subAccountId: SubAccountId.Default(),
                spenderSubId: SubAccountId.Default(),
            },
            result: {}
        }
    ];

    itForeach(tests, async (test) => {

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

        const result = await removeAllowanceHandler.process(test.input);
        expect(result).toEqual(test.result);

    });
});