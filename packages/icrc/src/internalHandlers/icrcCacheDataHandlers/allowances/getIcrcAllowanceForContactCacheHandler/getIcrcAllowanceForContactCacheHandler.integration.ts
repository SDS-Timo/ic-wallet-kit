import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";


describe("Unit GetIcrcAllowanceForContactCacheHandler tests", () => {
    const testData =
        [
            {
                name: "getAllowanceForContact return data",
                input: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x1"),
                    ownerPrincipal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                    spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    loadType: LoadType.Cache
                },
                data: {
                    cacheData: {
                        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                        subAccountId: "0x1",
                        senderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                        amount: BigInt(1000000),
                        expiration: undefined,
                    }
                },
                result: {
                    amount: BigInt(1000000),
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    expiration: undefined,
                    senderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    subAccountId: SubAccountId.parseFromString("0x1"),
                }
            },
            {
                name: "getAllowanceForContact return false",
                input: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    subAccountId: SubAccountId.parseFromString("0x0"),
                    ownerPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    spenderPrincipal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                    loadType: LoadType.Full
                },
                data: {
                    cacheData: {
                        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                        subAccountId: "0x0",
                        senderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                        amount: BigInt(0),
                        expiration: undefined,
                    }
                },
                result: {
                    amount: BigInt(10000000),
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    expiration: undefined,
                    senderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    subAccountId: SubAccountId.parseFromString("0x0"),
                }
            }
        ];

    for (let test of testData) {
        it(test.name, async () => {
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const cacheStorage = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;
            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText(test.input.spenderPrincipal))
            cacheStorage.getAllowanceForContact = jest.fn().mockReturnValue(test.data.cacheData);
            cacheStorage.updateAllowanceForContact = jest.fn().mockReturnValue(undefined);
            const expectedResult = FormResult.success(test.result)
            const logger = new MockLogger();
            const getIcrcAllowanceForContactCacheHandler = new GetIcrcAllowanceForContactCacheHandler(logger, identifierService, cacheStorage);

            const result = await getIcrcAllowanceForContactCacheHandler.handle(
                {
                    senderPrincipal: test.input.ownerPrincipal,
                    ledgerAddress: test.input.ledgerAddress,
                    subAccountId: test.input.subAccountId,
                    loadType: test.input.loadType
                });
            expect(result).toEqual(expectedResult);

        });
    }
}
);
