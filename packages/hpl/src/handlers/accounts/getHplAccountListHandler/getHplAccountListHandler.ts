import { GetHplAccountListInfo } from "@hpl/forms/accounts/getHplAccountListInfo";
import { GetHplAccountListResult } from "@hpl/forms/accounts/getHplAccountListResult";
import { LoadHplAccountsHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { HplAccountRepository } from "@hpl/repositories/persists/hplAccountRepository/hplAccountRepository";
import { BaseHandler, ILogger } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class GetHplAccountListHandler extends BaseHandler<GetHplAccountListInfo, GetHplAccountListResult> {
    private hplAccountRepository: HplAccountRepository;
    private hplVirtualAccountRepository: HplVirtualAccountRepository;
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private loadHplAccountHandler: LoadHplAccountsHandler,
        @Inject("HplAccountRepository")
        hplAccountRepository: HplAccountRepository,
        @Inject("HplVirtualAccountRepository")
        hplVirtualAccountRepository: HplVirtualAccountRepository,
    ) {
        super(logger);
        this.hplAccountRepository = hplAccountRepository;
        this.hplVirtualAccountRepository = hplVirtualAccountRepository;
    }
    async validate(form: GetHplAccountListInfo): Promise<void> {
    }

    async process(form: GetHplAccountListInfo): Promise<GetHplAccountListResult> {
        const cacheData = await this.loadHplAccountHandler.process({
            loadType: form.loadType
        });

        const virtualAccountList = await this.hplVirtualAccountRepository.getVirtualAccounts();

        const accountData = await this.hplAccountRepository.getAccounts();
        for (let index = 0; index < cacheData.accounts.length; index++) {
            const account = cacheData.accounts[index];
            let findSubAccount = accountData.find((a) => a.id === account.accountId.toString())
            if (!findSubAccount) {
                findSubAccount = {
                    id: account.accountId.toString(),
                    name: account.name,
                    ftId: account.ft.toString()
                }
                await this.hplAccountRepository.addAccount(findSubAccount)
            }
            account.name = findSubAccount.name;
            for (let va of account.virtualAccounts) {
                const item = virtualAccountList.find((v) => v.id === va.virtualAccountId.toString());
                va.name = item?.name ?? "";
            }
        }
        return {
            accounts: cacheData.accounts
        }
    }



}