import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { CheckLedgerPrincipalHandler } from "@hpl/handlers/checks/checkLedgerPrincipalHandler/checkLedgerPrincipalHandler";
import { IngressActorWrapper } from "@hpl/hplWrappers";

describe("Unit CheckDictionaryPrincipalHandler tests", () => {

        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");
        const checkLedgerPrincipalHandler = new CheckLedgerPrincipalHandler(logger, identifierService);

        it("CheckLedgerPrincipalHandler, ingressActorWrapper returns tokens", async () => {
                jest.restoreAllMocks();

                const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

                ingressActorWrapper.getAccounts = jest.fn().mockReturnValue(Promise.resolve(BigInt(11)));

                IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

                const result = await checkLedgerPrincipalHandler.process({ ledgerPrincipal: "mock-principal" });

                expect(result).toEqual({ isPrincipalExist: true });
        });

        it("CheckLedgerPrincipalHandler, ingressActorWrapper throw error", async () => {
                jest.restoreAllMocks();

                const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;

                ingressActorWrapper.getAccounts = jest.fn().mockRejectedValue(new Error("Mock Error"));

                IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

                const result = await checkLedgerPrincipalHandler.process({ ledgerPrincipal: "mock-principal" });

                expect(result).toEqual({ isPrincipalExist: false });
        });
})