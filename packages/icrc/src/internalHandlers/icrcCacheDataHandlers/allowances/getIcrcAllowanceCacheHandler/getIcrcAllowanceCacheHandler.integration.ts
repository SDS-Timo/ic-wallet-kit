import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService, LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { GetIcrcAllowanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceCacheHandler/getIcrcAllowanceCacheHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";

describe("Unit GetIcrcAllowanceCacheHandler getAssetAllowance tests", () => {
    const testData =
        [
            {
                name: "GetIcrcAllowance force = false",
                input: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x1"),
                    spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    spenderSubId: SubAccountId.parseFromString("0x1"),
                    loadType: LoadType.Cache
                },
                data: {
                    cacheData: {
                        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                        subAccountId: "0x1",
                        spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                        spenderSubId: "0x1",
                        amount: BigInt(1000000),
                        expiration: undefined,
                    }
                },
                result: FormResult.success({
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x1"),
                    spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    spenderSubId: SubAccountId.parseFromString("0x1"),
                    amount: BigInt(1000000),
                    expiration: undefined,
                })
            },
            {
                name: "GetIcrcAllowance force = true",
                input: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x0"),
                    spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    spenderSubId: SubAccountId.parseFromString("0x0"),
                    loadType: LoadType.Full
                },
                data: {
                    cacheData: undefined
                },
                result: FormResult.success({
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x0"),
                    spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    spenderSubId: SubAccountId.parseFromString("0x0"),
                    amount: BigInt(0),
                    expiration: undefined,
                })
            }
        ];

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const cacheStorage = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;
            cacheStorage.getAllowance = jest.fn().mockReturnValue(test.data.cacheData);
            cacheStorage.updateOrAddAllowance = jest.fn().mockReturnValue(undefined);
            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))
            const logger = new MockLogger();
            const getIcrcAllowanceHandler = new GetIcrcAllowanceCacheHandler(logger, identifierService, cacheStorage);
            const result = await getIcrcAllowanceHandler.handle(test.input);
            expect(result).toEqual(test.result);

        }, 10000);
    }
});