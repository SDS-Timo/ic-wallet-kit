
import { Principal } from "@dfinity/principal";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { CheckAllowanceByPrincipalHandler } from "@icrc/handlers/allowanceHandlers/checkAllowanceByPrincipalHandler/checkAllowanceByPrincipalHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";


describe("Unit CheckAllowanceByPrincipalHandler validate tests", () => {

    const tests = [
        {
            name: "CheckAllowanceByPrincipalHandler: allowance does not exist",
            input: {
                ledgerAddress: "ledgerAddress",
                spenderPrincipal: Principal.anonymous().toText(),
                ownerPrincipal: Principal.anonymous().toText(),
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.Default(),
            },
            data: {
                allowance: {
                    allowance: 0n,
                    expires_at: []
                },
                metaData:
                {
                    decimal: 8
                }
            },
            result: { allowance: undefined }

        },
        {
            name: "CheckAllowanceByPrincipalHandler: allowance exists",
            input: {
                ledgerAddress: "ledgerAddress",
                spenderPrincipal: Principal.anonymous().toText(),
                ownerPrincipal: Principal.anonymous().toText(),
                spenderSubId: SubAccountId.Default(),
                subAccountId: SubAccountId.Default(),
            },
            data: {
                allowance: {
                    allowance: 10n,
                    expires_at: []
                },
                metaData:
                {
                    decimals: 8
                }
            },
            result: {
                allowance: {
                    ledgerAddress: "ledgerAddress",
                    spender: Principal.anonymous().toText(),
                    spenderSubId: SubAccountId.Default(),
                    subAccountId: SubAccountId.Default(),
                    amount: 10n,
                    decimal: 8,
                    expiration: undefined
                }
            }

        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();

        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);

        assetMetaDataHandler.handle = jest.fn().mockReturnValue(test.data.metaData);

        ledgerWrapper.getAllowance = jest.fn().mockReturnValue(test.data.allowance);

        const checkAllowanceByPrincipalHandler = new CheckAllowanceByPrincipalHandler(logger,
            identifierService,
            assetMetaDataHandler
        );

        const result = await checkAllowanceByPrincipalHandler.process(test.input);

        expect(result).toEqual(test.result);
    });

});
