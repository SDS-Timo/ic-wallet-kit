import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { GetAllowanceSubAccountBalanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getAllowanceSubAccountBalanceCacheHandler/getAllowanceSubAccountBalanceCacheHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";


describe("Unit GetAllowanceSubAccountBalanceCacheHandler tests", () => {
    const testData =
        [
            {
                name: "getAllowanceSubAccountBalance force = false",
                input: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x1"),
                    principal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    loadType: LoadType.Cache
                },
                data: {
                    cacheData: {
                        subAccountId: SubAccountId.parseFromString("0x1"),
                        balance: BigInt(10000),
                    }
                },
                result: FormResult.success({
                    subAccountId: SubAccountId.parseFromString("0x1"),
                    balance: BigInt(10000),

                })
            },
            {
                name: "getAllowanceSubAccountBalance force = false",
                input: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x1"),
                    principal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    loadType: LoadType.Cache
                },
                data: {
                    cacheData: undefined
                },
                result: FormResult.success({
                    subAccountId: SubAccountId.parseFromString("0x1"),
                    balance: BigInt(0),

                })
            },
            {
                name: "getAllowanceSubAccountBalance force = true",
                input: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x0"),
                    principal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    loadType: LoadType.Full
                },
                data: {
                    cacheData: undefined
                },
                result: FormResult.success({
                    subAccountId: SubAccountId.parseFromString("0x0"),
                    balance: BigInt(6021973),
                })
            }
        ];

    for (let test of testData) {

        it(test.name, async () => {
            jest.restoreAllMocks();
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const cacheStorage = new (<new () => AssetLocalCache><unknown>AssetLocalCache)() as jest.Mocked<AssetLocalCache>;
            cacheStorage.getSubAccountById = jest.fn().mockReturnValue(test.data.cacheData);
            cacheStorage.setSubAccount = jest.fn().mockReturnValue(undefined);
            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))
            const logger = new MockLogger();
            const getIcrcAllowanceHandler = new GetAllowanceSubAccountBalanceCacheHandler(logger, identifierService, cacheStorage);

            const result = await getIcrcAllowanceHandler.handle(test.input);
            expect(result).toEqual(test.result);


        }, 10000);
    }
});