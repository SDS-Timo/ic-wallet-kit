import { IcrcTokenMetadataResponse } from "@dfinity/ledger-icrc";
import { ILogger } from "@ic-wallet-kit/common";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import { Inject, Service } from "typedi";
import { TokenApiResult } from "../tokenApiResult";


export interface CanisterId {
    root_canister_id: string;
    governance_canister_id: string;
    index_canister_id: string;
    swap_canister_id: string;
    ledger_canister_id: string;
}

export interface MetaData {
    url: string;
    name: string;
    description: string;
    logo: string;
}

export interface SnsToken {
    index: string;
    canister_ids: CanisterId;
    list_sns_canisters: any;
    meta: MetaData;
    parameters: any;
    nervous_system_parameters: any;
    swap_state: any;
    icrc1_metadata: any[],
    icrc1_fee: string[],
    icrc1_total_supply: string;
    swap_params: any;
    init: any;
    derived_state: any;
    lifecycle: any;
}

@Service()
export class SnsWrapper {

    constructor(
        @Inject("ILogger")
        private logger: ILogger
    ) {

    }

    public async getSNSTokens(): Promise<TokenApiResult[]> {

        const tokens = await this.fetchSnsTokens();

        const tokenList: TokenApiResult[] = [];
        for (const tkn of tokens) {
            const metadata = LedgerWrapper.parseMetadataInfo(tkn.icrc1_metadata as IcrcTokenMetadataResponse);

            const asset: TokenApiResult = {
                ledgerAddress: tkn.canister_ids.ledger_canister_id,
                logo: metadata.logo !== "" ? metadata.logo : "https://3r4gx-wqaaa-aaaaq-aaaia-cai.ic0.app" + tkn.meta.logo,
                name: metadata.name,
                symbol: metadata.symbol,
                decimal: metadata.decimals,
                indexAddress: tkn.canister_ids.index_canister_id || ""
            }

            const index = tokenList.findIndex(t => asset.symbol == t.symbol);

            if (index < 0) {
                tokenList.push(asset);
            }
            else {
                tokenList[index] = asset;
            }
        }

        return tokenList;

    }

    private async fetchSnsTokens(): Promise<SnsToken[]> {
        let tokens: SnsToken[] = [];

        for (let index = 0; index < 100; index++) {
            try {
                const response = await fetch(`https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io/v1/sns/list/page/${index}/slow.json`);
                if (response.ok && response.status === 200) {
                    const result: SnsToken[] = await response.json();
                    tokens.push(...result);
                    if (result.length < 10) break;
                } else {
                    break;
                }
            } catch (error) {
                this.logger.logError(error, "Get sns list error.");
                break;
            }

        }
        return tokens;
    }

}
