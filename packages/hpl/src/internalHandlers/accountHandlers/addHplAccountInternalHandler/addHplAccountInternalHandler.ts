import { AddHplAccountForm } from "@hpl/forms/accounts/addHplAccountForm";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplDataCacheRepository } from "@hpl/repositories";
import { CanisterService } from "@hpl/service";
import { AccountType, HplAccount } from "@hpl/types";
import { BaseHandler, getPropertyName, IdentifierService, ILogger, ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class AddHplAccountInternalHandler extends BaseHandler<
    AddHplAccountForm,
    HplAccount
> {
    private hplDataCacheRepository: IHplDataCacheRepository;
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private canisterService: CanisterService,
        @Inject("IHplDataCacheRepository")
        hplDataCacheRepository: IHplDataCacheRepository,

    ) {
        super(logger);
        this.hplDataCacheRepository = hplDataCacheRepository;
    }

    validate(form: AddHplAccountForm): Promise<void> {
        if (form.assetId === undefined) {
            throw new ValidationError("adding.hpl.account.internal.assetId.is.required",
                getPropertyName(form, f => f.assetId),
                "Field assetId is required");
        }

        if (!form.accountName) {
            throw new ValidationError("adding.hpl.account.internal.accountName.is.required",
                getPropertyName(form, f => f.accountName),
                "Field accountName is required");
        }

        return Promise.resolve();
    }

    async process(form: AddHplAccountForm): Promise<HplAccount> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        const accountId = await ingressActorWrapper.openAccount(form.assetId);
        const accountInfo = await ingressActorWrapper.getAccountInfo(accountId);
        const accountType = accountInfo.map((ai) => {
            return <AccountType>{
                ft: ai[1].ft
            }
        })[0];
        let hplData = this.hplDataCacheRepository.getHplDataByCanisterId(this.canisterService.getLedgerCanisterId());
        if (!hplData) {
            hplData = {
                accounts: {
                    accountLastId: BigInt(0),
                    accounts: []
                },
                virtualAccounts: {
                    virtualAccountLastId: BigInt(0),
                    virtualAccounts: []
                },
                ftAssets: {
                    ftAssetLastId: BigInt(0),
                    ftAssets: []
                },
                remotes: []
            };
        }
        hplData.accounts.accountLastId = hplData.accounts.accountLastId + BigInt(1);
        hplData.accounts.accounts.push({
            accountId: accountId,
            accountType: accountType
        })
        this.hplDataCacheRepository.setHplData(this.canisterService.getLedgerCanisterId(), hplData);
        const result: HplAccount = {
            accountId: accountId,
            ft: accountType.ft,
            amount: BigInt(0),
            currencyAmount: "0.0",
            transactionFee: "0",
            name: form.accountName,
            virtualAccounts: []
        }
        return result;
    }


}
