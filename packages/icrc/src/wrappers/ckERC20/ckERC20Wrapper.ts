import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { IdentifierService, ILogger } from "@ic-wallet-middleware/common";
import { idlFactory as ckERC20Factory } from "@icrc/candid/ckERC20/candid.did";
import { _SERVICE as ckERC20Service } from "@icrc/candid/ckERC20/service.did";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import "reflect-metadata";
import { Inject, Service } from "typedi";
import { TokenApiResult } from "../tokenApiResult";

@Service()
export class CkERC20Wrapper {

    constructor(
        @Inject("ILogger")
        private logger: ILogger,
        private identifierService: IdentifierService
    ) {

    }

    private ckERC20Actor(canisterId: string | Principal, agent: HttpAgent) {
        return Actor.createActor<ckERC20Service>(ckERC20Factory, {
            agent: agent,
            canisterId: canisterId,
        });
    }

    private async getOrchestratorInfo(canisterId: string | Principal, agent: HttpAgent): Promise<{ ledger: Principal, index: Principal }[]> {
        const actor = this.ckERC20Actor(canisterId, agent);
        const info = await actor.get_orchestrator_info();

        const canisters = info.managed_canisters.map((data) => {
            const ledger = data.ledger as any;
            const index = data.index as any;

            return {
                ledger: ledger[0].Installed.canister_id as Principal,
                index: index[0].Installed.canister_id as Principal,
            };
        });

        return canisters;
    }

    async getCkERC20Tokens(): Promise<TokenApiResult[]> {
        try {
            const canisterId = "vxkom-oyaaa-aaaar-qafda-cai";
            const agent = this.identifierService.getAgent();

            const canisters = await this.getOrchestratorInfo(canisterId, agent);
            const tokenPromises: Promise<TokenApiResult>[] = canisters.map(async (canister) => {
                const ledger = LedgerWrapper.create(agent, canister.ledger);

                const metaDataInfo = await ledger.getIcrcMetadataInfo();

                const token: TokenApiResult = {
                    ledgerAddress: canister.ledger.toString(),
                    decimal: metaDataInfo.decimals,
                    indexAddress: canister.index.toString(),
                    logo: metaDataInfo.logo,
                    name: metaDataInfo.name,
                    symbol: metaDataInfo.symbol,
                };

                return token;
            });

            return await Promise.all(tokenPromises);
        } catch (error) {

            this.logger.logError(error);
            return [];
        }
    }

}
