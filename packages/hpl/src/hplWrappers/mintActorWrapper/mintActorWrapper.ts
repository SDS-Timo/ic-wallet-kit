import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "@hpl/candid/mint/mint.did";
import { _SERVICE as HplMintActor } from "@hpl/candid/mint/mint.service.did";
import { HplMintActorError } from "@hpl/errors";


export class HplMintActorWrapper {
  private constructor(private actor: ActorSubclass<HplMintActor>) {
  }

  static create(agent: HttpAgent, canisterId: string) {
    const actor = HplMintActorWrapper.getHplMintActor(agent, canisterId);
    return new HplMintActorWrapper(actor);
  }

  public async isHplMinter(): Promise<boolean> {
    try {
      const isMint = await this.actor.isHplMinter()
      return isMint
    }
    catch (e: any) {
      throw new HplMintActorError("isHplMinter", e.message);
    }
  }

  private static getHplMintActor(agent: HttpAgent, canisterId: string): ActorSubclass<HplMintActor> {
    const mintActor = Actor.createActor<HplMintActor>(idlFactory, {
      agent: agent,
      canisterId: canisterId,
    });
    return mintActor;
  }

}
