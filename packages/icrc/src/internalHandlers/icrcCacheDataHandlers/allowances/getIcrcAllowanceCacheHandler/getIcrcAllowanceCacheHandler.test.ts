
import { Principal } from "@dfinity/principal";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { AllowanceSubAccountBalance } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getAllowanceSubAccountBalanceCacheHandler/getAllowanceSubAccountBalanceCacheHandler";
import { GetIcrcAllowanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceCacheHandler/getIcrcAllowanceCacheHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AllowanceCacheInfo, AllowanceCacheModel, SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit GetIcrcAllowanceCacheHandler tests", () => {

    const cacheRepository = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const getIcrcAllowanceCacheHandler = new GetIcrcAllowanceCacheHandler(logger, identifierService, cacheRepository);

    const data: AllowanceCacheModel = {
        ledgerAddress: "ledgerAddress",
        subAccountId: "0x3",
        spenderPrincipal: Principal.fromHex("0x10").toText(),
        spenderSubId: "0x2",
        amount: 2n,
        expiration: undefined
    };

    const fakeInfo = {
        ledgerAddress: "ledgerAddress",
        subAccountId: SubAccountId.parseFromString("0x3"),
        spenderPrincipal: Principal.fromHex("0x10").toText(),
        spenderSubId: SubAccountId.parseFromString("0x2")
    } as AllowanceCacheInfo;

    it("GetIcrcAllowanceCacheHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getAllowance = jest.fn().mockReturnValue(data);

        const result = await getIcrcAllowanceCacheHandler.getLocalCacheData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("GetIcrcAllowanceCacheHandler getLoadForceType", async () => {
        jest.restoreAllMocks();

        const result = await getIcrcAllowanceCacheHandler.getLoadForceType();
        await getIcrcAllowanceCacheHandler.validate(fakeInfo);

        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("GetIcrcAllowanceCacheHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;

        ledgerWrapper.getAllowance = jest.fn().mockReturnValue({
            allowance: data.amount,
            expires_at: []
        });

        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);

        const result = await getIcrcAllowanceCacheHandler.getExternalData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("GetIcrcAllowanceCacheHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: AllowanceSubAccountBalance = {} as AllowanceSubAccountBalance;

        cacheRepository.getAllowance = jest.fn().mockResolvedValue(undefined);
        cacheRepository.updateOrAddAllowance = jest.fn().mockImplementation((allowance) => { result = allowance; });

        await getIcrcAllowanceCacheHandler.updateField(fakeInfo, data);

        expect(result).toEqual(data);

    });


    it("GetIcrcAllowanceCacheHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "allowance unavailable",
            "Allowance Unavailable"
        );

        const result = getIcrcAllowanceCacheHandler.getCacheDataError(fakeInfo);

        expect(result).toEqual(data);

    });



})