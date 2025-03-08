import { Actor } from "@dfinity/agent";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { DictionaryActorError } from "@hpl/errors";
import { DictionaryActorWrapper } from "@hpl/hplWrappers/dictionaryActorWrapper/dictionaryActorWrapper";


describe("DictionaryActorWrapper tests", () => {
    const mockTokens = [{
        assetId: 1n,
        modifiedAt: 0n,
        logo: "mock-logo",
        name: "mock token 1",
        createdAt: 0n,
        symbol: "MT1",
    },
    {
        assetId: 2n,
        modifiedAt: 0n,
        logo: "mock-logo",
        name: "mock token 2",
        createdAt: 0n,
        symbol: "MT2",
    }];

    const mockResult = [
        {
            creationTime: 0n,
            assetId: 1n,
            logo: "mock-logo",
            name: "mock token 1",
            modificationTime: 0n,
            symbol: "MT1"
        },
        {
            creationTime: 0n,
            assetId: 2n,
            logo: "mock-logo",
            name: "mock token 2",
            modificationTime: 0n,
            symbol: "MT2"
        }
    ]

    let identifierService: ReturnType<typeof seedToIdentifierService>;
    let wrapper: DictionaryActorWrapper;
    let mockActor = {
        allTokens: jest.fn().mockResolvedValue(Promise.resolve(mockTokens))
    };
    Actor.createActor = jest.fn().mockReturnValue(mockActor);

    beforeEach(() => {
        identifierService = seedToIdentifierService("b");
        wrapper = DictionaryActorWrapper.create(identifierService.getAgent(), mockCanisterService.getDictionaryCanisterId());
    });

    it("should return all tokens", async () => {
        const result = await wrapper.allTokens();
        expect(result).toEqual(mockResult);
    });


    it("should return all tokens error", async () => {
        mockActor.allTokens = jest.fn().mockRejectedValue(new DictionaryActorError("allTokens", "Error"));
        await expect(wrapper.allTokens()).rejects.toThrow(new DictionaryActorError("allTokens", "Error"));
    });

});
