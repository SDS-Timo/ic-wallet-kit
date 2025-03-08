import { Actor, HttpAgent } from "@dfinity/agent";
import { backoff, chain, conditionalDelay, once, timeout } from "@dfinity/agent/lib/cjs/polling/strategy";
import { ILogger } from "@ic-wallet-middleware/common";
import { idlFactory } from "@icrc/candid/icrcLedger/icrcLedgerCandid.did";
import { _SERVICE as IcrcLedgerService } from "@icrc/candid/icrcLedger/icrcLedgerCandid.service.did";
import { SupportedStandardEnum } from "@icrc/types/wallets/supportedStandardEnum";

const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;
const DELAY = 250;

export class IcrcLedgerServiceWrapper {
    private constructor(private logger: ILogger, private icrcLedgerService: IcrcLedgerService) {
    }

    static create(params: IcrcActorParams, logger: ILogger) {

        const icrcLedgerService = Actor.createActor<IcrcLedgerService>(idlFactory, {
            agent: params.agent,
            canisterId: params.ledgerAddress,
            pollingStrategyFactory: this.pollingStrategy,
        });

        return new IcrcLedgerServiceWrapper(logger, icrcLedgerService);
    }

    private static pollingStrategy() {
        return chain(conditionalDelay(once(), DELAY), backoff(0, 0), timeout(FIVE_MINUTES_IN_MSEC));
    }

    public async getICRCSupportedStandards(): Promise<SupportedStandardEnum[]> {
        try {

            const response = await this.icrcLedgerService.icrc1_supported_standards();
            return response.map((standard: any) => standard.name as SupportedStandardEnum);
        } catch (error) {

            this.logger.logError(error, "IcrcLedgerServiceWrapper error");
            return [];
        }
    }

}

export interface IcrcActorParams {
    /** The ledgerAddress of the ICRC Ledger canister. */
    ledgerAddress: string;
    /** The HTTP agent used for communication with the Dfinity network. */
    agent: HttpAgent;
}
