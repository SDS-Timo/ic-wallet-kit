import { Principal } from "@dfinity/principal";
import { CacheDataError, LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcCacheBalanceErrorKey, IcrcCacheBalanceErrorMessage } from "@icrc/errors";
import { AllowanceSubAccountBalance, AllowanceSubAccountBalanceInfo, GetAllowanceSubAccountBalanceCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getAllowanceSubAccountBalanceCacheHandler/getAllowanceSubAccountBalanceCacheHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers";

describe("Unit GetAllowanceSubAccountBalanceCacheHandler tests", () => {

    const cacheRepository = new (<new () => AssetLocalCache><unknown>AssetLocalCache)() as jest.Mocked<AssetLocalCache>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const getAllowanceSubAccountBalanceCacheHandler = new GetAllowanceSubAccountBalanceCacheHandler(logger, identifierService, cacheRepository);

    const data: AllowanceSubAccountBalance = {
        balance: 1n,
        subAccountId: SubAccountId.parseFromString("0x3")
    };

    const fakeInfo = {
        subAccountId: data.subAccountId,
        principal: Principal.anonymous().toText()
    } as AllowanceSubAccountBalanceInfo;

    it("GetAllowanceSubAccountBalanceCacheHandler getLoadForceType", async () => {
        jest.restoreAllMocks();

        const result = await getAllowanceSubAccountBalanceCacheHandler.getLoadForceType();

        expect(result).toEqual([LoadType.Full, LoadType.Quick]);

    });

    it("GetAllowanceSubAccountBalanceCacheHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getSubAccountById = jest.fn().mockReturnValue({
            balance: data.balance,
            subAccountId: data.subAccountId.toString()
        });

        const result = await getAllowanceSubAccountBalanceCacheHandler.getLocalCacheData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("GetAllowanceSubAccountBalanceCacheHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;

        ledgerWrapper.getBalance = jest.fn().mockReturnValue(data.balance);

        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);

        const result = await getAllowanceSubAccountBalanceCacheHandler.getExternalData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("GetAllowanceSubAccountBalanceCacheHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: AllowanceSubAccountBalance = {} as AllowanceSubAccountBalance;

        cacheRepository.setSubAccount = jest.fn().mockImplementation((ledgerAddress, subAccount) => {
            result = {
                balance: subAccount.balance,
                subAccountId: SubAccountId.parseFromString(subAccount.subAccountId)
            };
        })

        await getAllowanceSubAccountBalanceCacheHandler.updateField(fakeInfo, data);

        expect(result).toEqual(data);

    });


    it("GetAllowanceSubAccountBalanceCacheHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            IcrcCacheBalanceErrorKey,
            IcrcCacheBalanceErrorMessage
        );

        const result = getAllowanceSubAccountBalanceCacheHandler.getCacheDataError(fakeInfo);

        expect(result).toEqual(data);

    });



})