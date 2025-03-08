import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { AddAssetForm } from "@icrc/types/forms/assets/addAssetForm";

import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddAssetHandler } from "@icrc/handlers";
import { GetTokenSNSCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/tokens/getTokenSNSCacheHandler";
import { LoadAssetHandler } from "@icrc/internalHandlers/loadAssetHandler/loadAssetHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { AccountDefaultEnum, SubAccountId, SupportedStandardEnum } from "@icrc/types";
import { IcrcLedgerServiceWrapper } from "@icrc/wrappers";

describe("AddAssetHandler Process Tests", () => {
    const validForm: AddAssetForm = {
        ledgerAddress: mockLedgerAddress,
        indexAddress: "test-index-address",
        name: "Test Asset",
        symbol: "TST",
        shortDecimal: 8,
    };

    const validData = {
        asset: {
            logo: "test-logo-url",
        },
        tokenHandler: {
            isSuccess: true,
            data: {
                TokenList: [
                    { ledgerAddress: "test-ledger-address", logo: "fallback-logo-url" },
                ],
            },
        }
    }

    const tests: testDefinition[] = [
        {
            name: "AddAssetHandler: success",
            input: validForm,
            data: validData,
            result: {
                asset: {
                    logo: "test-logo-url",
                }
            }
        },
        {
            name: "AddAssetHandler: success get tokens fails",
            input: validForm,
            data: {
                ...validData, tokenHandler: {
                    isSuccess: false,
                    data: undefined
                },
                asset: {
                    logo: undefined,
                }
            },
            result: {
                asset: {
                    logo: undefined,
                }
            }
        },
        {
            name: "AddAssetHandler: success get tokens success",
            input: validForm,
            data: {
                ...validData,
                asset: {
                    logo: undefined,
                }
            },
            result: {
                asset: {
                    logo: "fallback-logo-url",
                }
            }
        }
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const loadAssetHandler = new (<new () => LoadAssetHandler><unknown>LoadAssetHandler)() as jest.Mocked<LoadAssetHandler>;
        const getTokenSNSCacheHandler = new (<new () => GetTokenSNSCacheHandler><unknown>GetTokenSNSCacheHandler)() as jest.Mocked<GetTokenSNSCacheHandler>;
        const icrcLedgerServiceWrapper = new (<new () => IcrcLedgerServiceWrapper><unknown>IcrcLedgerServiceWrapper)() as jest.Mocked<IcrcLedgerServiceWrapper>;

        assetRepository.getAssetNextIndex = jest.fn().mockResolvedValue(1);
        assetRepository.addAsset = jest.fn().mockResolvedValue(undefined);

        loadAssetHandler.process = jest.fn().mockResolvedValue(test.data.asset);

        getTokenSNSCacheHandler.handle = jest.fn().mockResolvedValue(test.data.tokenHandler);

        const addAssetHandler = new AddAssetHandler(
            logger,
            assetRepository,
            loadAssetHandler,
            identifierService,
            getTokenSNSCacheHandler
        );

        IcrcLedgerServiceWrapper.create = jest.fn().mockReturnValue(icrcLedgerServiceWrapper);

        icrcLedgerServiceWrapper.getICRCSupportedStandards = jest.fn().mockResolvedValue([SupportedStandardEnum.ICRC1]);

        await addAssetHandler.process(test.input);

        expect(assetRepository.getAssetNextIndex).toHaveBeenCalled();


        expect(loadAssetHandler.process).toHaveBeenCalledWith({
            ledgerAddress: "test-ledger-address",
            indexAddress: "test-index-address",
            subAccounts: [SubAccountId.Default()],
            loadType: LoadType.Quick,
        });

        expect(assetRepository.addAsset).toHaveBeenCalledWith(
            expect.objectContaining({
                ledgerAddress: "test-ledger-address",
                name: "Test Asset",
                symbol: "TST",
                logo: test.result?.asset.logo,
                supportedStandards: [SupportedStandardEnum.ICRC1],
                subAccounts: [
                    {
                        name: AccountDefaultEnum[AccountDefaultEnum.Default],
                        ledgerAddress: "test-ledger-address",
                        subAccountId: "0x0",
                    },
                ],
            })
        );
    });


});
