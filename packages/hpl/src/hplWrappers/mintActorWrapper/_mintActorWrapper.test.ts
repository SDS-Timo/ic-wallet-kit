import { Actor } from "@dfinity/agent";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplMintActorError } from "@hpl/errors";
import { HplMintActorWrapper } from "@hpl/hplWrappers/mintActorWrapper/mintActorWrapper";


describe("HplMintActorWrapper tests", () => {


  let identifierService: ReturnType<typeof seedToIdentifierService>;
  let wrapper: HplMintActorWrapper;
  let mockActor = {
    isHplMinter: jest.fn().mockResolvedValue(Promise.resolve(true))
  };
  Actor.createActor = jest.fn().mockReturnValue(mockActor);

  beforeEach(() => {
    identifierService = seedToIdentifierService("b");
    wrapper = HplMintActorWrapper.create(identifierService.getAgent(), mockCanisterService.getDictionaryCanisterId());
  });

  it("should return is minter", async () => {
    const result = await wrapper.isHplMinter();
    expect(result).toEqual(true);
  });


  it("should return is minter error", async () => {
    mockActor.isHplMinter = jest.fn().mockRejectedValue(new HplMintActorError("isHplMinter", "Error"));
    await expect(wrapper.isHplMinter()).rejects.toThrow(new HplMintActorError("isHplMinter", "Error"));
  });

});
