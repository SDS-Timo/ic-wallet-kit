import { Principal } from "@dfinity/principal";
import { BaseHandler, getPropertyName, IdentifierService, ILogger, ValidationError } from "@ic-wallet-kit/common";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { ManualAssetView, SubAccountId } from "@icrc/types";
import { CheckAssetForm } from "@icrc/types/forms";
import { IndexWrapper } from "@icrc/wrappers/icrc/indexWrapper/indexWrapper";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import { Inject, Service } from "typedi";

@Service()
export class CheckAssetHandler extends BaseHandler<CheckAssetForm, ManualAssetView> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("AssetRepository")
        private assetRepository: AssetRepository) {
        super(logger);
        this.assetRepository = assetRepository;
    }

    public validate(form: CheckAssetForm): Promise<void> {

        if (!form.ledgerAddress) {
            throw new ValidationError("check.asset.ledgerAddress.is.required",
                getPropertyName(form, (v) => v.ledgerAddress),
                "Field ledgerAddress is required");
        }

        if (!form.indexAddress) {
            throw new ValidationError("check.asset.indexAddress.is.required",
                getPropertyName(form, (v) => v.indexAddress),
                "Field indexAddress is required");
        }

        return Promise.resolve();
    }

    public async process(form: CheckAssetForm): Promise<ManualAssetView> {

        const result: ManualAssetView =
        {
            indexAddress: form.indexAddress,
            ledgerAddress: form.ledgerAddress,
            contractResult: {
                isSuccess: true,
                message: "Ledger interface recognized. It is recommended not to change the token's symbol, name and decimals",
                localizationCode: "ledgerAddress.success"
            },
            indexResult: {
                isSuccess: true,
                message: "Index interface recognized",
                localizationCode: "indexAddress.success"
            },
        };

        const isAssetExist = await this.assetRepository.isAssetExist(form.ledgerAddress);

        if (isAssetExist) {
            result.contractResult = {
                isSuccess: false,
                message: "Asset already Imported",
                localizationCode: "ledgerAddress.assetAlreadyExist"
            };
        }
        else {

            try {

                const agent = await this.identifierService.getAnonymousAgent();

                const ledgerWrapper = LedgerWrapper.create(
                    agent,
                    form.ledgerAddress
                );

                const metaData = await ledgerWrapper.getIcrcMetadataInfo();

                const transactionFee = await ledgerWrapper.getTransactionFee();

                result.decimal = metaData.decimals;
                result.name = metaData.name;
                result.symbol = metaData.symbol;
                result.transactionFee = transactionFee;
            }
            catch (e: any) {
                result.contractResult = {
                    isSuccess: false,
                    message: "Ledger interface not recognized",
                    localizationCode: "ledgerAddress.invalid"
                };
            }

            try {
                const indexWrapper = IndexWrapper.create(form.indexAddress as any);

                await indexWrapper.getTransactions(Principal.fromText(form.indexAddress), SubAccountId.parseFromString("0x0"), { take: 10 });
            }
            catch (e: any) {

                result.indexResult = {
                    isSuccess: false,
                    message: "Index interface not recognized",
                    localizationCode: "indexAddress.invalid"
                };
            }
        }

        return result;
    }


}
