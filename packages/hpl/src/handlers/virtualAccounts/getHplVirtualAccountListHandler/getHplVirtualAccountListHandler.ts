import { GetHplVirtualAccountListInfo, GetHplVirtualAccountListResult } from "@hpl/forms";
import { LoadHplVirtualAccountsHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories/persists/hplVirtualAccountRepository/hplVirtualAccountRepository";
import { BaseHandler, ILogger } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class GetHplVirtualAccountListHandler extends BaseHandler<GetHplVirtualAccountListInfo, GetHplVirtualAccountListResult> {
    private hplVirtualAccountRepository: HplVirtualAccountRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private loadHplVirtualAccountsHandler: LoadHplVirtualAccountsHandler,
        @Inject("HplVirtualAccountRepository")
        hplVirtualAccountRepository: HplVirtualAccountRepository
    ) {
        super(logger);
        this.hplVirtualAccountRepository = hplVirtualAccountRepository;
    }
    async validate(form: GetHplVirtualAccountListInfo): Promise<void> {
    }

    async process(form: GetHplVirtualAccountListInfo): Promise<GetHplVirtualAccountListResult> {
        const cacheData = await this.loadHplVirtualAccountsHandler.process({
            loadType: form.loadType
        });

        const virtualAccountData = await this.hplVirtualAccountRepository.getVirtualAccounts();
        for (let index = 0; index < cacheData.virtualAccounts.length; index++) {
            const virtualAccount = cacheData.virtualAccounts[index];
            let findVirtualAccount = virtualAccountData.find((a) => a.id === virtualAccount.virtualAccountId.toString())
            if (!findVirtualAccount) {
                findVirtualAccount = {
                    id: virtualAccount.virtualAccountId.toString(),
                    name: virtualAccount.name,
                    accountId: virtualAccount.accountId.toString()
                }
                await this.hplVirtualAccountRepository.addVirtualAccount(findVirtualAccount)
            }
            virtualAccount.name = findVirtualAccount.name;
        }

        return {
            virtualAccount: cacheData.virtualAccounts
        }
    }
}