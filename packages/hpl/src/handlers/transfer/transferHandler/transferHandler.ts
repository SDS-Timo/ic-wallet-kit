import { HplTransferForm, HplTransferResult } from "@hpl/forms/transfers/hplTransferForm";
import { HplFtAssetCacheDataHandler } from "@hpl/internalHandlers";
import { CanisterService } from "@hpl/service";
import { TransferAccountReferenceProvider } from "@hpl/utils/transferProvider/transferProvider";
import { AmountProvider, BaseHandler, getPropertyName, IdentifierService, ILogger, LoadType, ValidationError } from "@ic-wallet-kit/common";
import { bigIntReplacer, HPLClient, SimpleTransferStatus } from "@research-ag/hpl-client";
import "reflect-metadata";
import { catchError, lastValueFrom, map, of } from "rxjs";
import { Inject, Service } from "typedi";

@Service()
export class TransferHandler extends BaseHandler<HplTransferForm, HplTransferResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        public canisterService: CanisterService,
        private hplFtAssetCacheDataHandler: HplFtAssetCacheDataHandler
    ) {
        super(logger);
    }
    validate(form: HplTransferForm): Promise<void> {

        if (form.assetId === undefined) {
            throw new ValidationError("hpl.transfer.assetId.is.required",
                getPropertyName(form, f => f.assetId),
                "Field assetId is required");
        }

        if (form.amount === undefined) {
            throw new ValidationError("hpl.transfer.amount.is.required",
                getPropertyName(form, f => f.amount),
                "Field amount is required");
        }

        if (!form.txFrom) {
            throw new ValidationError("hpl.transfer.from.is.required",
                getPropertyName(form, f => f.txFrom),
                "Field from is required");
        }
        if (!form.txTo) {
            throw new ValidationError("hpl.transfer.to.is.required",
                getPropertyName(form, f => f.txTo),
                "Field to is required");
        }

        return Promise.resolve();
    }

    async process(form: HplTransferForm): Promise<HplTransferResult> {

        const assetsResult = await this.hplFtAssetCacheDataHandler.handle({
            loadType: LoadType.Cache
        });

        const asset = assetsResult.data?.ftAssets.find((a) => a.assetId === form.assetId);

        if (!asset) {
            throw new ValidationError("asset.not.found",
                getPropertyName(form, f => f.assetId),
                "Asset Not Found");
        }
        const sentAmount = AmountProvider.toBigInt(form.amount, asset.ftAssetInfo.decimals);

        if (!sentAmount) {
            throw new ValidationError("transaction.invalid.amount", getPropertyName(form, f => f.amount), "Invalid amount");
        }

        let identity = this.identifierService.getIdentity();
        const ledgerId = this.canisterService.getLedgerCanisterId();
        const hplClient = new HPLClient(ledgerId, "ic");
        await hplClient.setIdentity(identity as any);

        const aggregator = await hplClient.pickAggregator();
        if (aggregator) {
            const txId = await hplClient.simpleTransfer(aggregator,
                TransferAccountReferenceProvider.toTransferAccountReference(form.txFrom),
                TransferAccountReferenceProvider.toTransferAccountReference(form.txTo),
                form.assetId,
                sentAmount);
            let validTx = false;
            let insufficientFunds = false;
            let errorMessage = "";
            await lastValueFrom(
                hplClient.pollTx(aggregator, txId).pipe(
                    map((x: SimpleTransferStatus) => {
                        if (x.status === "processed") {
                            if (x.statusPayload[0].failure) {
                                const ftTransfer = x.statusPayload[0].failure.ftTransfer;
                                errorMessage = JSON.stringify(ftTransfer, bigIntReplacer);
                                if (errorMessage.includes("InsufficientFunds")) {
                                    insufficientFunds = true;
                                }
                            } else if (x.statusPayload[0].success) {
                                validTx = true;
                            }

                        }
                    }),
                    catchError((e: any) => {
                        errorMessage = e.message;
                        return of(null);
                    }),
                )
            );
            if (validTx) {
                return {

                }
            }
            if (insufficientFunds) {
                throw new ValidationError("insufficient.funds", "", "Insufficient funds");
            }
            if (errorMessage) {
                throw new ValidationError("simple.transfer.error", "", errorMessage);
            }
        }

        throw new ValidationError("could.not.pick.aggregator", "", "Could not pick aggregator");
    }



}