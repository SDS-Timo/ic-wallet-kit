import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "@hpl/candid/dictionary/dictionary.did";
import { _SERVICE as DictionaryActor, FungibleToken } from "@hpl/candid/dictionary/dictionary.service.did";
import { DictionaryActorError } from "@hpl/errors/dictionaryActor.error";
import { HplDictionaryCacheModel } from "@hpl/types/cache/hplDictionaryCacheModel";



export class DictionaryActorWrapper {
    private constructor(private actor: ActorSubclass<DictionaryActor>) {
    }

    static create(agent: HttpAgent, canisterId: string) {
        const actor = DictionaryActorWrapper.getDictionaryActorWrapper(agent, canisterId);
        return new DictionaryActorWrapper(actor);
    }

    public async allTokens(): Promise<HplDictionaryCacheModel[]> {
        try {
            const tokens = await this.actor.allTokens()
            return this.parseFungibleToken(tokens);
        }
        catch (e: any) {
            throw new DictionaryActorError("allTokens", e.message);
        }
    }

    private static getDictionaryActorWrapper(agent: HttpAgent, canisterId: string): ActorSubclass<DictionaryActor> {
        const actor = Actor.createActor<DictionaryActor>(idlFactory, {
            agent: agent,
            canisterId: canisterId,
        });
        return actor;
    }

    private parseFungibleToken(tokens: FungibleToken[])
    {
        const auxTkns: HplDictionaryCacheModel[] = [];
        tokens.map((tkn) => {
            auxTkns.push({
                creationTime: tkn.createdAt,
                assetId: tkn.assetId,
                logo: tkn.logo,
                name: tkn.name,
                modificationTime: tkn.modifiedAt,
                symbol: tkn.symbol,
            });
        });
        return auxTkns;
    };

}
