import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockIndexAddress, mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { CheckAssetHandler } from "@icrc/handlers/assetHandlers/checkAssetHandler/checkAssetHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { SubAccountId } from "@icrc/types";
import { CheckAssetForm } from "@icrc/types/forms";
import { IndexWrapper } from "@icrc/wrappers/icrc/indexWrapper/indexWrapper";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

describe("CheckAssetHandler Process Tests", () => {
    const validForm: CheckAssetForm = {
        ledgerAddress: mockLedgerAddress,
        indexAddress: mockIndexAddress,
    };

    const tests: testDefinition[] = [
        {
            name: "CheckAssetHandler: Asset already exists",
            input: { ...validForm },
            data: {
                isAssetExist: true,
            },
            result: {
                indexAddress: mockIndexAddress,
                ledgerAddress: mockLedgerAddress,
                contractResult: {
                    isSuccess: false,
                    message: "Asset already Imported",
                    localizationCode: "ledgerAddress.assetAlreadyExist"
                },
                indexResult: {
                    isSuccess: true,
                    message: "Index interface recognized",
                    localizationCode: "indexAddress.success"
                }
            },
        },
        {
            name: "CheckAssetHandler: Invalid ledger and index interfaces",
            input: { ...validForm },
            data: {
                isAssetExist: false,
            },
            result: {
                ledgerAddress: mockLedgerAddress,
                indexAddress: mockIndexAddress,
                contractResult: {
                    isSuccess: false,
                    message: "Ledger interface not recognized",
                    localizationCode: "ledgerAddress.invalid",
                },
                indexResult: {
                    isSuccess: false,
                    message: "Index interface not recognized",
                    localizationCode: "indexAddress.invalid",
                },
            },
        },
        {
            name: "CheckAssetHandler: Valid ledger and index interfaces",
            input: { ...validForm },
            data: {
                isAssetExist: false,
                ledgerMock: {
                    getIcrcMetadataInfo: jest.fn().mockResolvedValue({
                        decimals: 8,
                        name: "Test Token",
                        symbol: "TST",
                    }),
                    getTransactionFee: jest.fn().mockResolvedValue(BigInt(100)),
                },
                indexMock: {
                    getTransactions: jest.fn().mockResolvedValue([]),
                },
            },
            result: {
                ledgerAddress: mockLedgerAddress,
                indexAddress: mockIndexAddress,
                contractResult: {
                    isSuccess: true,
                    message: "Ledger interface recognized. It is recommended not to change the token's symbol, name and decimals",
                    localizationCode: "ledgerAddress.success",
                },
                indexResult: {
                    isSuccess: true,
                    message: "Index interface recognized",
                    localizationCode: "indexAddress.success",
                },
                name: "Test Token",
                symbol: "TST",
                decimal: 8,
                transactionFee: BigInt(100),
            },
        }
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const identifierService = mockAnonymousIdentifierService();

        assetRepository.isAssetExist = jest.fn().mockResolvedValue(test.data?.isAssetExist || false);

        if (test.data?.ledgerMock) {
            LedgerWrapper.create = jest.fn().mockReturnValue({
                ...test.data.ledgerMock,
            });
        } else {
            LedgerWrapper.create = jest.fn().mockImplementation(() => {
                throw new Error("Ledger interface not recognized");
            });
        }

        if (test.data?.indexMock) {
            IndexWrapper.create = jest.fn().mockReturnValue({
                ...test.data.indexMock,
            });
        } else {
            IndexWrapper.create = jest.fn().mockImplementation(() => {
                throw new Error("Index interface not recognized");
            });
        }

        const checkAssetHandler = new CheckAssetHandler(logger, identifierService, assetRepository);

        const result = await checkAssetHandler.process(test.input);

        expect(result).toEqual(test.result);

        if (test.result.contractResult?.isSuccess && test.data?.ledgerMock) {
            expect(LedgerWrapper.create).toHaveBeenCalledWith(expect.anything(), test.input.ledgerAddress);
            expect(test.data.ledgerMock.getIcrcMetadataInfo).toHaveBeenCalled();
            expect(test.data.ledgerMock.getTransactionFee).toHaveBeenCalled();
        }

        if (test.result.indexResult?.isSuccess && test.data?.indexMock) {
            expect(IndexWrapper.create).toHaveBeenCalledWith(test.input.indexAddress);
            expect(test.data.indexMock.getTransactions).toHaveBeenCalledWith(
                expect.anything(),
                SubAccountId.parseFromString("0x0"),
                { take: 10 }
            );
        }
    });
});
