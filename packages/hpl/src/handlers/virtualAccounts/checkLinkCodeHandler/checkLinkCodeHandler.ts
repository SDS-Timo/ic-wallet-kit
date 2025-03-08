import { CheckLinkCodeForm, CheckLinkCodeResult } from "@hpl/forms";
import { IngressActorWrapper, OwnersActorWrapper } from "@hpl/hplWrappers";
import { HplAssetRepository } from "@hpl/repositories";
import { CanisterService } from "@hpl/service";
import { BaseHandler, getPropertyName, IdentifierService, ILogger, ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class CheckLinkCodeHandler extends BaseHandler<CheckLinkCodeForm, CheckLinkCodeResult> {
    private hplAssetRepository: HplAssetRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private canisterService: CanisterService,
        @Inject("HplAssetRepository")
        hplAssetRepository: HplAssetRepository,
    ) {
        super(logger);
        this.hplAssetRepository = hplAssetRepository;
    }

    validate(form: CheckLinkCodeForm): Promise<void> {
        if (!form.linkCode) {
            throw new ValidationError("check.code.linkCode.is.required",
                getPropertyName(form, f => f.linkCode),
                "Field linkCode is required");
        }

        return Promise.resolve();

    }

    async process(form: CheckLinkCodeForm): Promise<CheckLinkCodeResult> {
        const result: CheckLinkCodeResult = {
            remoteInfo: undefined,
            owner: undefined,
            error: ""
        }
        let ownerInfo;
        try {
            const code = form.linkCode;
            if (code.length > 2) {
                const size = Number(`0x${code[0]}`) + 1;
                const princCode = BigInt(`0x${code.slice(1, code.length - size)}`);
                ownerInfo = { ownerId: princCode, linkId: BigInt(`0x${code.slice(-size)}`) };
            }
        } catch (error: any) {
            this.logger.logError(error);
            result.error = error.message;
            return result;
        }


        if (!ownerInfo) {
            result.error = "Invalid code"
            return result;
        }
        const ownersActorWrapper = OwnersActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getOwnerCanisterId()
        );

        let ownerPrincipal;
        try {
            ownerPrincipal = await ownersActorWrapper.get(ownerInfo.ownerId);
        }
        catch (e: any) {
            result.error = "Invalid ownerId"
            return result;
        }

        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        const remoteAccountInfoResult = await ingressActorWrapper.remoteAccountInfo({
            id: [ownerPrincipal, ownerInfo.linkId]
        });
        const remoteAccountInfo = remoteAccountInfoResult
            .map((r) => {
                return {
                    remoteId: r[0][0],
                    accountId: r[0][1],
                    remoteInfo: r[1]
                }
            })
            .find((r) => r.accountId === ownerInfo.linkId);
        if (!remoteAccountInfo) {
            result.error = "RemoteInfo not found"
            return result;
        }

        const remoteAccountStateResult = await ingressActorWrapper.getState(
            BigInt(0),
            BigInt(0),
            BigInt(0),
            [{
                id: [ownerPrincipal, ownerInfo.linkId]
            }]);

        const remoteState = remoteAccountStateResult.remoteAccounts.find((r) => r.remoteAccountId === remoteAccountInfo.accountId)

        if (!remoteState) {
            result.error = "RemoteState not found"
            return result;
        }

        const asset = await this.hplAssetRepository.getAssetById(remoteAccountInfo.remoteInfo.ft.toString())
        result.remoteInfo = {
            name: "",
            remoteAccountId: remoteAccountInfo.accountId.toString(),
            expired: Number(remoteState.time),
            amount: remoteState.accountState.ft.toString(),
            assetId: remoteAccountInfo.remoteInfo.ft.toString(),
            assetName: asset.name
                ? asset.name
                : asset.assetName,
            assetSymbol: asset.symbol
                ? asset.symbol
                : asset.assetSymbol,
            assetLogo: asset.logo,
            code: form.linkCode,
        }
        result.owner = ownerPrincipal;
        return result;
    }
}