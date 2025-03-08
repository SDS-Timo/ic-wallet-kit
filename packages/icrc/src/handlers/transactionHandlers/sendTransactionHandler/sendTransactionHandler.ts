import { AmountProvider, BaseHandler, ILogger, IdentifierService, LoadType, ValidationError, getPropertyName } from "@ic-wallet-kit/common";
import { GetListTransactionHandler } from "@icrc/handlers/transactionHandlers/getListTransactionHandler/getListTransactionHandler";
import { GetSubAccountByHandler } from "@icrc/internalHandlers/getSubAccountByHandler/getSubAccountByHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AssetRepository } from "@icrc/repositories";
import { SendTransactionForm } from "@icrc/types/transactions/sendTransactionForm";
import { SendTransactionResult } from "@icrc/types/transactions/sendTransactionResult";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import { Inject, Service } from "typedi";

@Service()
export class SendTransactionHandler extends BaseHandler<SendTransactionForm, SendTransactionResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private assetMetaDataHandler: AssetMetaDataCacheHandler,
        private getSubAccountByHandler: GetSubAccountByHandler,
        private subAccountBalanceHandler: SubAccountBalanceHandler,
        private getListTransactionHandler: GetListTransactionHandler,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository
    ) {
        super(logger);
    }

    public validate(form: SendTransactionForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("transfer.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        if (!form.receiverAccountPrincipal) {
            throw new ValidationError("transfer.receiverAccountPrincipal.is.required",
                getPropertyName(form, (v) => v.receiverAccountPrincipal),
                "Field receiverAccountPrincipal is required");
        }

        return Promise.resolve();
    }

    public async process(form: SendTransactionForm): Promise<SendTransactionResult> {
        const assetWallet = await this.assetRepository.getAssetOrDefault(form.ledgerAddress);
        if (!assetWallet) {
            throw new ValidationError("asset.not.found",
                getPropertyName(form, f => f.ledgerAddress),
                "Asset Not Found");
        }

        let asset = await this.assetMetaDataHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Quick
        });

        const sentAmount = AmountProvider.toBigInt(form.amount, asset.decimals);

        if (!sentAmount) {
            throw new ValidationError("transaction.invalid.amount", getPropertyName(form, f => f.amount), "Invalid amount");
        }

        const subAccount = await this.getSubAccountByHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Full,
            subAccountId: form.subAccountId
        });

        if (sentAmount > 0) {
            if ((subAccount.data?.balance ?? BigInt(0)) - asset.fee < sentAmount) {
                throw new ValidationError("balance.less.amount",
                    getPropertyName(form, f => f.amount),
                    "Balance should be more that sent amount");
            }
        }
        else {
            throw new ValidationError("balance.less.amount",
                getPropertyName(form, f => f.amount),
                "Amount should be more that 0");
        }

        const ledgerWrapper = LedgerWrapper.create(this.identifierService.getAgent(), form.ledgerAddress);

        await ledgerWrapper.transfer({
            amount: sentAmount,
            fromSubAccountId: form.subAccountId,
            toAccountPrincipal: form.receiverAccountPrincipal,
            toSubAccountId: form.receiverSubAccountId
        });

        await this.subAccountBalanceHandler.handle({
            ledgerAddress: form.ledgerAddress,
            loadType: LoadType.Full,
            subAccountId: form.subAccountId
        });

        if (form.receiverAccountPrincipal.toText() === this.identifierService.getPrincipalStr()) {
            await this.subAccountBalanceHandler.handle({
                ledgerAddress: form.ledgerAddress,
                loadType: LoadType.Full,
                subAccountId: form.receiverSubAccountId
            });
        }

        const transactions = await this.getListTransactionHandler.handle(
            {
                ledgerAddress: form.ledgerAddress,
                subAccountId: form.subAccountId,
                pageInfo: {
                    take: 1
                }
            })

        return {
            transactions: transactions.data?.transactions || []
        }
    }


}