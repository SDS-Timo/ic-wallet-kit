import { IdentifierService, ILogger } from "@ic-wallet-middleware/common";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import "reflect-metadata";
import { Inject, Service } from "typedi";
import { TokenApiResult } from "../tokenApiResult";

@Service()
export class ManualTokenWrapper {

    constructor(
        @Inject("ILogger")
        private logger: ILogger,
        private identifierService: IdentifierService
    ) {

    }

    async getTokens(): Promise<TokenApiResult[]> {
        try {
            const agent = this.identifierService.getAgent();

            const canisters: { address: string, index: string }[] =
                [
                    {
                        address: "6c7su-kiaaa-aaaar-qaira-cai",
                        index: "oo6x4-xiaaa-aaaap-abrza-cai"
                    }
                ];

            const tokenPromises: Promise<TokenApiResult>[] = canisters.map(async (canister) => {
                const ledger = LedgerWrapper.create(agent, canister.address);

                const metaDataInfo = await ledger.getIcrcMetadataInfo();

                const token: TokenApiResult = {
                    ledgerAddress: canister.address,
                    decimal: metaDataInfo.decimals,
                    indexAddress: canister.index,
                    logo: metaDataInfo.logo,
                    name: metaDataInfo.name,
                    symbol: metaDataInfo.symbol,
                };

                return token;
            });

            const OGYL = async () => {
                const ledger = LedgerWrapper.create(agent, "jwcfb-hyaaa-aaaaj-aac4q-cai");

                const metaDataInfo = await ledger.getIcrcMetadataInfo();

                const token: TokenApiResult = {
                    ledgerAddress: "jwcfb-hyaaa-aaaaj-aac4q-cai",
                    decimal: metaDataInfo.decimals,
                    indexAddress: "",
                    logo: "data:image/png;base64,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",
                    name: "Origyn Legacy",
                    symbol: "OGYL",
                };

                return token;

            }

            tokenPromises.push(OGYL());

            return await Promise.all(tokenPromises);
        } catch (error) {

            this.logger.logError(error, "Manual wrapper error");
            return [];
        }
    }

}
