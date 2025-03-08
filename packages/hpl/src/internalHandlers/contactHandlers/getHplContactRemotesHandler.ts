import { LoadHplContactRemotesForm } from "@hpl/forms";
import { HplDictionaryCacheDataHandler, HplOwnerCacheDataHandler, HplRemoteAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers";
import { HplRemotesCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplRemotesCacheDataHandler/hplRemotesCacheDataHandler";
import { HplAssetRepository } from "@hpl/repositories";
import { HplDictionaryCacheModel, HplRemote, HplStateRemoteAccountsCacheModel } from "@hpl/types";
import { HplRemoteCacheModel } from "@hpl/types/cache/hplContactCacheModel";
import { BaseHandler, getPropertyName, getPxlCode, ILogger, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";



@Service()
export class GetHplContactRemotesHandler extends BaseHandler<
    LoadHplContactRemotesForm,
    HplRemote[]
> {
    private hplAssetRepository: HplAssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private hplRemotesCacheDataHandler: HplRemotesCacheDataHandler,
        private hplRemoteAccountsStateCacheDataHandler: HplRemoteAccountsStateCacheDataHandler,
        private hplOwnerCacheDataHandler: HplOwnerCacheDataHandler,
        @Inject("HplAssetRepository")
        hplAssetRepository: HplAssetRepository,
        private hplDictionaryCacheDataHandler: HplDictionaryCacheDataHandler
    ) {
        super(logger);
        this.hplAssetRepository = hplAssetRepository;
    }

    validate(form: LoadHplContactRemotesForm): Promise<void> {

        if (!form.principal) {
            throw new ValidationError("load.hpl.contact.remotes.principal.is.required",
                getPropertyName(form, f => f.principal),
                "Field principal is required");
        }

        return Promise.resolve();

    }

    async process(form: LoadHplContactRemotesForm): Promise<HplRemote[]> {

        const remotesResult = await this.hplRemotesCacheDataHandler.handle({
            principal: form.principal,
            loadType: form.loadType
        });
        const remotesInfo = remotesResult.data?.remotes ?? [];

        const remotesStateResult = await this.hplRemoteAccountsStateCacheDataHandler.handle({
            accountCount: BigInt(0),
            ftAssetCount: BigInt(0),
            virtualAccountCount: BigInt(0),
            remoteAccounts: [{ idRange: [form.principal, BigInt(0), []] }],
            loadType: form.loadType
        });
        const remotesState = remotesStateResult.data ?? [];

        const ownerIdResult = await this.hplOwnerCacheDataHandler.handle({
            principal: form.principal,
            loadType: form.loadType
        });
        const ownerId = ownerIdResult.data?.ownerId
        const assetDictionary = await this.hplDictionaryCacheDataHandler.handle({
            loadType: form.loadType
        });
        const dictionaryModels = assetDictionary.data?.assetsDictionary ?? [];
        const remotes = await this.formatHplRemotes(remotesInfo, remotesState, ownerId, dictionaryModels);
        return remotes;
    }


    private async formatHplRemotes(info: HplRemoteCacheModel[],
        state: HplStateRemoteAccountsCacheModel[],
        ownerId: bigint | undefined,
        dictionaryModels: HplDictionaryCacheModel[]): Promise<HplRemote[]> {
        const assets = await this.hplAssetRepository.getAssets()

        const remotes: HplRemote[] = [];
        info.map((rmtInfo) => {
            const rmtState = state.find((rmtState) => rmtInfo.accountId === rmtState.remoteAccountId);
            const asset = assets.find((a) => a.id == rmtInfo.remoteInfo.ft.toString());
            const assetDictionary = dictionaryModels.find((d) => d.assetId === rmtInfo.remoteInfo.ft)
            if (rmtState) {
                remotes.push({
                    name: "",
                    remoteAccountId: rmtInfo.accountId.toString(),
                    expired: Number(rmtState.time),
                    amount: rmtState.accountState.ft.toString(),
                    assetId: rmtInfo.remoteInfo.ft.toString(),
                    assetName: asset
                        ? asset.name
                            ? asset.name
                            : asset.assetName
                        : "",
                    assetSymbol: asset
                        ? asset.symbol
                            ? asset.symbol
                            : asset.assetSymbol
                        : "",
                    assetLogo: asset?.logo
                        ? asset.logo
                        : assetDictionary
                            ? assetDictionary.logo
                            : "",
                    code: ownerId ? getPxlCode(ownerId.toString(), rmtInfo.accountId) : "",
                });
            }
        });
        return remotes;
    }
}
