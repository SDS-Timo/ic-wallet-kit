import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "@hpl/candid/owners/owners.did";
import { _SERVICE as OwnersActor } from "@hpl/candid/owners/owners.service.did";
import { OwnerActorError } from "../../errors/ownerActor.error";


export class OwnersActorWrapper {
  private constructor(private actor: ActorSubclass<OwnersActor>) {
  }

  static create(agent: HttpAgent, canisterId: string) {
    const actor = OwnersActorWrapper.getOwnerActor(agent, canisterId);
    return new OwnersActorWrapper(actor);
  }

  public async lookup(principal: Principal): Promise<[] | [bigint]> {
    try {
      const ownerId = await this.actor.lookup(principal)
      return ownerId
    }
    catch (e: any) {
      throw new OwnerActorError("lookup", e.message);
    }

  }

  public async get(ownerId: bigint): Promise<Principal> {
    try {
      const principal = await this.actor.get(ownerId)
      return principal
    }
    catch (e: any) {
      throw new OwnerActorError("get", e.message);
    }

  }

  private static getOwnerActor(agent: HttpAgent, canisterId: string): ActorSubclass<OwnersActor> {
    const ownersActor = Actor.createActor<OwnersActor>(idlFactory, {
      agent: agent,
      canisterId: canisterId,
    });
    return ownersActor;
  }

}
