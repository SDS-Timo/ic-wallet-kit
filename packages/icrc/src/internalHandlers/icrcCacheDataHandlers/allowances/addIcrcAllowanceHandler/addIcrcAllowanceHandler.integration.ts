import { FormResult, IdentifierService } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { AddIcrcAllowanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/addIcrcAllowanceHandler/addIcrcAllowanceHandler";
import { AssetMetaDataCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/assetMetaDataCacheHandler/assetMetaDataCacheHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AssetManagerConfiguration, SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";


describe("Unit AddIcrcAllowanceHandler tests", () => {
    const testData =
        [
            {
                name: "AddIcrcAllowanceHandler: success",
                input: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x0"),
                    spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    spenderSubId: SubAccountId.parseFromString("0x0"),
                    amount: BigInt(1000000),
                    expiration: undefined
                },
                data: {
                    cacheData: {
                        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                        subAccountId: "0x0",
                        spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                        spenderSubId: "0x0",
                        amount: BigInt(1000000),
                        expiration: undefined,
                    },
                    metaData: {
                        symbol: "ICP",
                        name: "ICP",
                        decimals: 8,
                        logo: "",
                        fee: 1000n
                    }
                },
                result: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x0"),
                    spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    spenderSubId: SubAccountId.parseFromString("0x0"),
                    decimal: 8,
                    amount: BigInt(1000000),
                    expiration: undefined,
                }
            }
        ];

    for (let test of testData) {
        it(test.name, async () => {
            const logger = new MockLogger();
            const assetManagerConfiguration = new AssetManagerConfiguration();
            assetManagerConfiguration.defaultDateTimeFormat = "MM/DD/YYYY HH:mm";
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const assetMetaDataHandler = new (<new () => AssetMetaDataCacheHandler><unknown>AssetMetaDataCacheHandler)() as jest.Mocked<AssetMetaDataCacheHandler>;
            assetMetaDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.metaData));

            const cacheStorage = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;
            cacheStorage.addAllowance = jest.fn().mockReturnValue(test.data.cacheData);
            const addIcrcAllowanceHandler = new AddIcrcAllowanceHandler(logger, identifierService, cacheStorage, assetManagerConfiguration, assetMetaDataHandler);
            LedgerWrapper.approveAllowance = jest.fn().mockReturnValue(Promise.resolve(undefined));
            const expectedResult = FormResult.success(test.result)
            try {
                const result = await addIcrcAllowanceHandler.handle(test.input);
                expect(result).toEqual(expectedResult);
            }
            catch (e) {
                expect(e).toEqual(expectedResult);
            }
        });
    }
});