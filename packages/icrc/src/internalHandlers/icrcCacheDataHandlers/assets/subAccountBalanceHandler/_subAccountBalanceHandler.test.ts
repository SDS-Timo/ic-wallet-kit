import { LoadType } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import {
    IcrcCacheBalanceErrorKey,
    IcrcCacheBalanceErrorMessage,
} from "@icrc/errors/cacheErrorMessages";
import { SubAccountBalance, SubAccountBalanceHandler, SubAccountBalanceInfo } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AssetLocalCache } from "@icrc/repositories";
import { SubAccountId } from "@icrc/types";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";

describe("SubAccountBalanceHandler Tests", () => {
    const validInfo: SubAccountBalanceInfo = {
        ledgerAddress: "mock-ledger-address",
        subAccountId: SubAccountId.Default(),
        loadType: LoadType.Cache
    };

    const validBalanceData: SubAccountBalance = {
        balance: BigInt(1000),
        subAccountId: SubAccountId.Default(),
    };

    let logger: MockLogger;
    let identifierService: ReturnType<typeof mockAnonymousIdentifierService>;
    let localCacheRepository: jest.Mocked<AssetLocalCache>;

    beforeEach(() => {
        logger = new MockLogger();
        identifierService = mockAnonymousIdentifierService();
        localCacheRepository = new (<new () => AssetLocalCache>(
            <unknown>AssetLocalCache
        ))() as jest.Mocked<AssetLocalCache>;

        jest.clearAllMocks();
    });

    describe("getLoadForceType", () => {
        it("should return correct load force types", () => {
            const handler = new SubAccountBalanceHandler(
                logger,
                identifierService,
                localCacheRepository
            );

            expect(handler.getLoadForceType()).toEqual([LoadType.Full, LoadType.Quick]);
        });
    });

    describe("getCacheDataError", () => {
        it("should return correct cache data error", () => {
            const handler = new SubAccountBalanceHandler(
                logger,
                identifierService,
                localCacheRepository
            );

            const error = handler.getCacheDataError(validInfo);

            expect(error.errorType).toBe(IcrcCacheBalanceErrorKey);
            expect(error.message).toBe(IcrcCacheBalanceErrorMessage);
        });
    });

    describe("getExternalData", () => {
        it("should fetch balance data from external source", async () => {
            const mockLedgerWrapper = {
                getBalance: jest.fn().mockResolvedValue(BigInt(1000)),
            };
            LedgerWrapper.create = jest.fn().mockReturnValue(mockLedgerWrapper);

            const handler = new SubAccountBalanceHandler(
                logger,
                identifierService,
                localCacheRepository
            );

            const result = await handler.getExternalData(validInfo);

            expect(result).toEqual(validBalanceData);
            expect(LedgerWrapper.create).toHaveBeenCalledWith(
                identifierService.getAgent(),
                validInfo.ledgerAddress
            );
            expect(mockLedgerWrapper.getBalance).toHaveBeenCalledWith(
                validInfo.subAccountId,
                identifierService.getPrincipal()
            );
        });
    });

    describe("updateField", () => {
        it("should update balance data in the local cache", () => {
            const handler = new SubAccountBalanceHandler(
                logger,
                identifierService,
                localCacheRepository
            );

            localCacheRepository.setSubAccount = jest.fn();

            handler.updateField(validInfo, validBalanceData);

            expect(localCacheRepository.setSubAccount).toHaveBeenCalledWith(
                validInfo.ledgerAddress,
                {
                    balance: validBalanceData.balance,
                    subAccountId: validInfo.subAccountId.toString(),
                }
            );
        });
    });

    describe("getLocalCacheData", () => {
        it("should return balance data from the local cache", async () => {
            localCacheRepository.getSubAccountById = jest
                .fn()
                .mockReturnValue({
                    balance: validBalanceData.balance,
                    subAccountId: validBalanceData.subAccountId.toString(),
                });

            const handler = new SubAccountBalanceHandler(
                logger,
                identifierService,
                localCacheRepository
            );

            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toEqual(validBalanceData);
        });

        it("should return undefined if local cache is empty", async () => {
            localCacheRepository.getSubAccountById = jest
                .fn()
                .mockReturnValue(undefined);

            const handler = new SubAccountBalanceHandler(
                logger,
                identifierService,
                localCacheRepository
            );

            const result = await handler.getLocalCacheData(validInfo);

            expect(result).toBeUndefined();
        });
    });
});
