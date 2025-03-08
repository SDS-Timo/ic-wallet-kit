import { Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { OwnerActorError } from "@hpl/errors";
import { OwnersActorWrapper } from "@hpl/hplWrappers/ownersActorWrapper/ownersActorWrapper";


describe("OwnersActorWrapper tests", () => {
  const principal = "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe";

  let identifierService: ReturnType<typeof seedToIdentifierService>;
  let wrapper: OwnersActorWrapper;
  let mockActor = {
    lookup: jest.fn().mockResolvedValue(Promise.resolve([40n])),
    get: jest.fn().mockResolvedValue(Promise.resolve(Principal.fromText(principal)))
  };
  Actor.createActor = jest.fn().mockReturnValue(mockActor);

  beforeEach(() => {
    identifierService = seedToIdentifierService("b");
    wrapper = OwnersActorWrapper.create(identifierService.getAgent(), mockCanisterService.getDictionaryCanisterId());
  });

  it("should return lookup", async () => {
    const result = await wrapper.lookup(Principal.fromText(principal));
    expect(result).toEqual([40n]);
  });


  it("should return all tokens error", async () => {
    mockActor.lookup = jest.fn().mockRejectedValue(new OwnerActorError("lookup", "Error"));
    await expect(wrapper.lookup(Principal.fromText(principal))).rejects.toThrow(new OwnerActorError("lookup", "Error"));
  });

  it("should return get", async () => {
    const result = await wrapper.get(40n);
    expect(result).toEqual(Principal.fromText(principal));
  });


  it("should return all tokens error", async () => {
    mockActor.get = jest.fn().mockRejectedValue(new OwnerActorError("get", "Error"));
    await expect(wrapper.get(40n)).rejects.toThrow(new OwnerActorError("get", "Error"));
  });

});
