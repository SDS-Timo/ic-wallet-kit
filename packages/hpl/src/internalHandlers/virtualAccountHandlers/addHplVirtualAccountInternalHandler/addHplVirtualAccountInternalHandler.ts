import { AddHplVirtualAccountForm } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplMintCacheDataHandler, HplOwnerCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers";
import { IHplDataCacheRepository } from "@hpl/repositories";
import { CanisterService } from "@hpl/service";
import { HplVirtualAccount } from "@hpl/types";
import { BaseHandler, getPropertyName, getPxlCode, IdentifierService, ILogger, LoadType, ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class AddHplVirtualAccountInternalHandler extends BaseHandler<
    AddHplVirtualAccountForm,
    HplVirtualAccount
> {
    private hplDataCacheRepository: IHplDataCacheRepository;
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private canisterService: CanisterService,
        @Inject("IHplDataCacheRepository")
        hplDataCacheRepository: IHplDataCacheRepository,
        private hplOwnerCacheDataHandler: HplOwnerCacheDataHandler,
        private hplMintCacheDataHandler: HplMintCacheDataHandler
    ) {
        super(logger);
        this.hplDataCacheRepository = hplDataCacheRepository;
    }

    validate(form: AddHplVirtualAccountForm): Promise<void> {
        if (form.assetId === undefined) {
            throw new ValidationError("adding.hpl.virtual.account.internal.assetId.is.required",
                getPropertyName(form, f => f.assetId),
                "Field assetId is required");
        }

        if (form.accountId === undefined) {
            throw new ValidationError("adding.hpl.virtual.account.internal.accountId.is.required",
                getPropertyName(form, f => f.accountId),
                "Field accountId is required");
        }

        if (!form.accessByPrincipal) {
            throw new ValidationError("adding.hpl.virtual.account.internal.accessByPrincipal.is.required",
                getPropertyName(form, f => f.accessByPrincipal),
                "Field accessByPrincipal is required");
        }

        if (form.amount === undefined) {
            throw new ValidationError("adding.hpl.virtual.account.internal.amount.is.required",
                getPropertyName(form, f => f.amount),
                "Field amount is required");
        }

        return Promise.resolve();
    }

    async process(form: AddHplVirtualAccountForm): Promise<HplVirtualAccount> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        const virtualAccountId = await ingressActorWrapper.openVirtualAccount(
            form.assetId,
            form.accountId,
            form.accessByPrincipal,
            form.amount,
            form.expiration
        );

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
        hplData.virtualAccounts.virtualAccountLastId = hplData.virtualAccounts.virtualAccountLastId + BigInt(1);
        hplData.virtualAccounts.virtualAccounts.push({
            virtualAccountId: virtualAccountId,
            virtualAccountInfo: {
                accountType: {
                    ft: form.assetId
                },
                principal: form.accessByPrincipal.toString()
            }
        })
        this.hplDataCacheRepository.setHplData(this.canisterService.getLedgerCanisterId(), hplData);

        const mintResult = await this.hplMintCacheDataHandler.handle({
            canisterId: form.accessByPrincipal.toString(),
            loadType: LoadType.Full
        });
        if (!mintResult.isSuccess) {
            throw mintResult.errors;
        }
        const mint = mintResult.data ?? {
            canisterId: form.accessByPrincipal.toString(),
            isMinter: false
        }

        const ownerDataResult = await this.hplOwnerCacheDataHandler.handle({
            principal: this.identifierService.getPrincipal(),
            loadType: LoadType.Cache
        });
        if (!ownerDataResult.isSuccess) {
            throw ownerDataResult.errors
        }
        const ownerData = ownerDataResult.data ?? {
            ownerId: undefined
        }

        const result: HplVirtualAccount = {
            virtualAccountId: virtualAccountId,
            accountId: form.accountId,
            accessBy: form.accessByPrincipal.toString(),
            amount: form.amount,
            currencyAmount: "0.0",
            code: getPxlCode(ownerData.ownerId ? ownerData.ownerId.toString() : "0", virtualAccountId),
            isMint: mint.isMinter,
            name: form.virtualAccountName,
            expiration: form.expiration,
            assetId: form.assetId,
            assetSymbol: ""
        }
        return result;
    }


}
