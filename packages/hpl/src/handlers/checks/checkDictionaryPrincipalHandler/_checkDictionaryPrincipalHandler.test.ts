import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { CheckDictionaryPrincipalHandler } from "@hpl/handlers/checks/checkDictionaryPrincipalHandler/checkDictionaryPrincipalHandler";
import { DictionaryActorWrapper } from "@hpl/hplWrappers";

describe("Unit CheckDictionaryPrincipalHandler tests", () => {

        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");
        const checkDictionaryPrincipalHandler = new CheckDictionaryPrincipalHandler(logger, identifierService);

        it("CheckDictionaryPrincipalHandler, dictionaryActorWrapper returns tokens", async () => {
                jest.restoreAllMocks();

                const dictionaryActorWrapper = new (<new () => DictionaryActorWrapper><unknown>DictionaryActorWrapper)() as jest.Mocked<DictionaryActorWrapper>;

                dictionaryActorWrapper.allTokens = jest.fn().mockReturnValue(Promise.resolve([
                        {
                                assetId: 1n,
                                creationTime: 0n,
                                modificationTime: 0n,
                                logo: "mock-logo",
                                name: "mock-name",
                                symbol: "mock-symbol"
                        }
                ]));

                DictionaryActorWrapper.create = jest.fn().mockReturnValue(dictionaryActorWrapper);

                const result = await checkDictionaryPrincipalHandler.process({ dictionaryPrincipal: "mock-principal" });

                expect(result).toEqual({ isPrincipalExist: true });
        });

        it("CheckDictionaryPrincipalHandler, dictionaryActorWrapper throw error", async () => {
                jest.restoreAllMocks();

                const dictionaryActorWrapper = new (<new () => DictionaryActorWrapper><unknown>DictionaryActorWrapper)() as jest.Mocked<DictionaryActorWrapper>;

                dictionaryActorWrapper.allTokens = jest.fn().mockRejectedValue(new Error("Mock Error"));

                DictionaryActorWrapper.create = jest.fn().mockReturnValue(dictionaryActorWrapper);

                const result = await checkDictionaryPrincipalHandler.process({ dictionaryPrincipal: "mock-principal" });

                expect(result).toEqual({ isPrincipalExist: false });
        });
})