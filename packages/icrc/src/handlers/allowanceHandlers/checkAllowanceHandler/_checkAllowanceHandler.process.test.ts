import { ValidationError } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockAssetManagerConfiguration, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { CheckAllowanceHandler } from "@icrc/handlers/allowanceHandlers/checkAllowanceHandler/checkAllowanceHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AllowanceLocalCache, AllowanceRepository, AssetRepository } from "@icrc/repositories";
import { CheckAllowanceForm } from "@icrc/types/forms";

import { SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit CheckAllowanceHandler process tests", () => {

    const form: CheckAllowanceForm = {
        ledgerAddress: "xxx",
        spenderPrincipal: mockSpenderPrincipalString(),
        subAccountId: SubAccountId.Default(),
        spenderSubId: SubAccountId.Default(),
    };

    const tests = [
        {
            name: "CheckAllowanceHandler: Asset not supported standard ICRC-2",
            input: form,
            data:
            {
                supportedStandard: false,
                isExistStorageAllowance: true
            },
            error: new ValidationError("asset.not.supported.standard", "", "Asset not supported standard ICRC-2")
        },
        {
            name: "CheckAllowanceHandler: Allowance does not exists",
            input: form,
            data:
            {
                supportedStandard: true,
                metaData: {
                    decimals: 8
                },
                allowance:
                {
                    allowance: 0,
                    expiration: []
                },
                isExistStorageAllowance: true
            },
            result:
            {
                allowance: undefined,
                existAllowance: false
            }
        },
        {
            name: "CheckAllowanceHandler: Allowance  exists",
            input: form,
            data:
            {
                supportedStandard: true,
                metaData: {
                    decimals: 8
                },
                allowance:
                {
                    allowance: 10n,
                    expiration: []
                },
                isExistStorageAllowance: false
            },
            result:
            {
                allowance: {
                    amount: 10n,
                    ledgerAddress: 'xxx',
                    subAccountId: SubAccountId.Default(),
                    spenderPrincipal: 'lrxaf-gyaca',
                    spenderSubId: SubAccountId.Default(),
                    decimal: 8,
                    expiration: undefined
                },
                existAllowance: true
            }
        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();


        const allowanceRepository = new (<new () => AllowanceRepository><unknown>AllowanceRepository)() as jest.Mocked<AllowanceRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const allowanceLocalCache = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);

        ledgerWrapper.getAllowance = jest.fn().mockResolvedValue(test.data.allowance);

        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data.metaData);
        assetRepository.checkSupportedStandard = jest.fn().mockResolvedValue(test.data.supportedStandard);
        allowanceRepository.isExistStorageAllowance = jest.fn().mockResolvedValue(test.data.isExistStorageAllowance);

        allowanceLocalCache.updateOrAddAllowance = jest.fn().mockResolvedValue(Promise.resolve());
        allowanceRepository.addAllowance = jest.fn().mockResolvedValue(Promise.resolve());

        const checkAllowanceHandler = new CheckAllowanceHandler(logger,
            mockAssetManagerConfiguration,
            assetMetaDataHandler,
            assetRepository,
            allowanceRepository,
            identifierService,
            allowanceLocalCache
        );

        const result = await checkAllowanceHandler.process(test.input);

        expect(result).toEqual(test.result);

        if (!test.data.isExistStorageAllowance) {
            expect(allowanceRepository.addAllowance).toHaveBeenCalled();
        }

        if (test.result?.existAllowance) {
            expect(allowanceLocalCache.updateOrAddAllowance).toHaveBeenCalled();
        }
    });

});
