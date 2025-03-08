import { BaseHandler, ILogger, PageResultEmptyKey, ValidationError } from "@ic-wallet-middleware/common";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { TransactionRepository } from "@icrc/repositories/persists/transactionRepository/transactionRepository";
import { SubAccountId } from "@icrc/types";
import { TransactionManagerConfiguration } from "@icrc/types/configuration/transactionManagerConfiguration";
import { GetListTransactionForm } from "@icrc/types/transactions/getListTransactionForm";
import { GetListTransactionResult } from "@icrc/types/transactions/getListTransactionResult";
import { Inject, Service } from "typedi";


@Service()
export class GetListTransactionHandler extends BaseHandler<GetListTransactionForm, GetListTransactionResult> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        @Inject("TransactionConfiguration")
        private configuration: TransactionManagerConfiguration,
        private transactionRepository: TransactionRepository,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository
    ) {
        super(logger);
    }

    public validate(form: GetListTransactionForm): Promise<void> {

        if (form.pageInfo.nextPageKey == PageResultEmptyKey) {
            throw new ValidationError("get.list.transaction.nextPageKey.lastIndex",
                "nextPageKey",
                "It was last page. Please check PageResult.hasNext on previous request. Please make sure that hasNext is true.");
        }

        if (!form.ledgerAddress) {
            throw new ValidationError("get.list.transaction.ledgerAddress.is.required",
                "ledgerAddress",
                "Field ledgerAddress is required");
        }

        return Promise.resolve();
    }

    public async process(form: GetListTransactionForm): Promise<GetListTransactionResult> {
        const asset = await this.assetRepository.getAssetOrDefault(form.ledgerAddress);
        if (!asset) {
            throw new ValidationError("get.list.transaction.asset.not.found", "ledgerAddress", "Asset Not Found");
        }

        const subAccountIds = form.subAccountId
            ? [form.subAccountId]
            : asset.subAccounts.map((sa) => SubAccountId.parseFromString(sa.subAccountId));

        const assetInfo = {
            indexAsset: asset.indexAddress,
            subAccountIds: subAccountIds,
            symbol: asset.tokenSymbol,
            pageInfo: form.pageInfo
        }

        let result: GetListTransactionResult;
        switch (asset.tokenSymbol) {
            case "ICP":
                result = await this.transactionRepository.getIcpListTransaction(assetInfo,
                    {
                        url: this.configuration.icpUrl, //"https://rosetta-api.internetcomputer.org/search/transactions",
                        blockchain: this.configuration.icpBlockchain, //"Internet Computer",
                        network: this.configuration.icpNetwork, // "00000000000000020101",
                        canisterId: asset.ledgerAddress
                    }
                );
                break;
            case "OGYL":
                result = await this.transactionRepository.getIcpListTransaction(assetInfo,
                    {
                        url: this.configuration.ogyUrl, // "https://rosetta-ogy.origyn.ch/search/transactions",
                        blockchain: this.configuration.ogyBlockchain, //"ORIGYN Foundation",
                        network: this.configuration.ogyNetwork, //`"00000000012000b90101",
                        canisterId: asset.ledgerAddress
                    }
                );
                break;
            default:
                result = await this.transactionRepository.getIcrcListTransactionByAsset(assetInfo);
                break;
        }

        return result;
    }
}