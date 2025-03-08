
import { Principal } from "@dfinity/principal";
import { CacheDataError, LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { AllowanceSubAccountBalance } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getAllowanceSubAccountBalanceCacheHandler/getAllowanceSubAccountBalanceCacheHandler";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { AllowanceLocalCache } from "@icrc/repositories";
import { AllowanceContactCacheInfo, AllowanceContactCacheModel, SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit GetIcrcAllowanceForContactCacheHandler tests", () => {

    const cacheRepository = new (<new () => AllowanceLocalCache><unknown>AllowanceLocalCache)() as jest.Mocked<AllowanceLocalCache>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const getIcrcAllowanceForContactCacheHandler = new GetIcrcAllowanceForContactCacheHandler(logger, identifierService, cacheRepository);

    const data: AllowanceContactCacheModel = {
        ledgerAddress: "ledgerAddress",
        subAccountId: "0x3",
        senderPrincipal: Principal.fromHex("0x10").toText(),
        amount: 2n,
        expiration: undefined
    };

    const fakeInfo = {
        ledgerAddress: "ledgerAddress",
        subAccountId: SubAccountId.parseFromString("0x3"),
        senderPrincipal: Principal.fromHex("0x10").toText(),
        loadType: LoadType.Full
    } as AllowanceContactCacheInfo;

    it("GetIcrcAllowanceForContactCacheHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getAllowanceForContact = jest.fn().mockReturnValue(data);

        const result = await getIcrcAllowanceForContactCacheHandler.getLocalCacheData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("GetIcrcAllowanceForContactCacheHandler getLoadForceType", async () => {
        jest.restoreAllMocks();

        await getIcrcAllowanceForContactCacheHandler.validate(fakeInfo);
        const result = await getIcrcAllowanceForContactCacheHandler.getLoadForceType();

        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("GetIcrcAllowanceForContactCacheHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;

        ledgerWrapper.getAllowance = jest.fn().mockReturnValue({
            allowance: data.amount,
            expires_at: []
        });

        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);

        const result = await getIcrcAllowanceForContactCacheHandler.getExternalData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("GetIcrcAllowanceForContactCacheHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: AllowanceSubAccountBalance = {} as AllowanceSubAccountBalance;

        cacheRepository.getAllowanceForContact = jest.fn().mockResolvedValue(undefined);
        cacheRepository.updateAllowanceForContact = jest.fn().mockImplementation((allowance) => { result = allowance; });

        await getIcrcAllowanceForContactCacheHandler.updateField(fakeInfo, data);

        expect(result).toEqual(data);

    });


    it("GetIcrcAllowanceForContactCacheHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "allowance unavailable",
            "Allowance Unavailable"
        );

        const result = getIcrcAllowanceForContactCacheHandler.getCacheDataError(fakeInfo);

        expect(result).toEqual(data);

    });


    it("GetIcrcAllowanceForContactCacheHandler processError", async () => {
        jest.restoreAllMocks();

        const result = getIcrcAllowanceForContactCacheHandler.processError({});

        expect(result).toEqual([]);

    });

})