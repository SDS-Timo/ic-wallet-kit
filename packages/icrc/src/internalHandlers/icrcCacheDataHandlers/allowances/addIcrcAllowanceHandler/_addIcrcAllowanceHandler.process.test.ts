import { LoadType } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { AddIcrcAllowanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/addIcrcAllowanceHandler/addIcrcAllowanceHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AssetManagerConfiguration, SubAccountId } from "@icrc/types";
import { AllowanceDataModel } from "@icrc/types/allowances/allowanceDataModel";
import { convertBigIntToDateString } from "@icrc/utils/dateTimeUtils";
import { LedgerWrapper } from "@icrc/wrappers";

describe("AddIcrcAllowanceHandler Tests", () => {
    const validAllowanceData: AllowanceDataModel = {
        ledgerAddress: "mock-ledger-address",
        subAccountId: SubAccountId.parseFromString("0x2"),
        spenderPrincipal: "spender-principal",
        spenderSubId: SubAccountId.parseFromString("0x3"),
        amount: BigInt(100000000),
        expiration: BigInt(Date.now()),
    };

    const tests = [
        {
            name: "AddIcrcAllowanceHandler: Successfully adds an allowance",
            input: validAllowanceData,
            data: {
                assetMetaData: { decimals: 8 },
                addedAllowance: {
                    ledgerAddress: "mock-ledger-address",
                    subAccountId: "0x2",
                    spenderPrincipal: "spender-principal",
                    spenderSubId: "0x3",
                    amount: BigInt(100000000),
                    expiration: validAllowanceData.expiration,
                },
            },
            result: {
                amount: validAllowanceData.amount,
                ledgerAddress: validAllowanceData.ledgerAddress,
                subAccountId: validAllowanceData.subAccountId,
                spenderPrincipal: validAllowanceData.spenderPrincipal,
                spenderSubId: validAllowanceData.spenderSubId,
                decimal: 8,
                expiration: convertBigIntToDateString(
                    validAllowanceData.expiration,
                    "YYYY-MM-DDTHH:mm:ss"
                ),
            },
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const allowanceCacheStorage = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;
        const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
        const mockConfiguration: AssetManagerConfiguration = {
            defaultDateTimeFormat: "YYYY-MM-DDTHH:mm:ss",
        } as AssetManagerConfiguration;

        LedgerWrapper.approveAllowance = jest.fn().mockResolvedValue(undefined);
        allowanceCacheStorage.addAllowance = jest.fn().mockReturnValue(test.data?.addedAllowance);
        assetMetaDataHandler.handle = jest.fn().mockResolvedValue(test.data?.assetMetaData);

        const handler = new AddIcrcAllowanceHandler(
            logger,
            identifierService,
            allowanceCacheStorage,
            mockConfiguration,
            assetMetaDataHandler
        );

        await handler.validate(test.input);
        const result = await handler.process(test.input);

        expect(result).toEqual(test.result);

        // Verifying calls
        expect(LedgerWrapper.approveAllowance).toHaveBeenCalledWith(
            test.input,
            identifierService.getAgent()
        );
        expect(allowanceCacheStorage.addAllowance).toHaveBeenCalledWith(test.input);
        expect(assetMetaDataHandler.handle).toHaveBeenCalledWith({
            ledgerAddress: test.input.ledgerAddress,
            loadType: LoadType.Cache,
        });
    });
});
