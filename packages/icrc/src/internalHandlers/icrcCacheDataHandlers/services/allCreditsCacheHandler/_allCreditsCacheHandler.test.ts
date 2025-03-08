import { CacheDataError, LoadType } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcCacheMetadataErrorKey, IcrcCacheMetadataErrorMessage } from "@icrc/errors";
import { AllCreditsCacheHandler, AllCreditsInfo, AllCreditsResult } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/allCreditsCacheHandler/allCreditsCacheHandler";
import { ServiceLocalCache } from "@icrc/repositories";
import { LocalCacheCreditModel } from "@icrc/types";
import { Icrc84ActorWrapper } from "@icrc/wrappers";

describe("Unit AllCreditsCacheHandler tests", () => {

    const cacheRepository = new (<new () => ServiceLocalCache><unknown>ServiceLocalCache)() as jest.Mocked<ServiceLocalCache>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const allCreditsCacheHandler = new AllCreditsCacheHandler(logger, identifierService, cacheRepository);

    const data: AllCreditsResult = {
        credits: [
            {
                ledgerAddress: "ledgerAddress",
                credit: 3n
            }
        ]
    };

    const fakeInfo = {} as AllCreditsInfo;

    it("AllCreditsCacheHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getAllCredits = jest.fn().mockReturnValue(data.credits);

        const result = await allCreditsCacheHandler.getLocalCacheData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("AllCreditsCacheHandler getLoadForceType", async () => {
        jest.restoreAllMocks();

        const result = await allCreditsCacheHandler.getLoadForceType();
        await allCreditsCacheHandler.validate(fakeInfo);

        expect(result).toEqual([LoadType.Full, LoadType.Quick]);
    });

    it("AllCreditsCacheHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
        Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);

        icrc84ActorWrapper.getAllCredits = jest.fn().mockReturnValue(Promise.resolve(data.credits));

        const result = await allCreditsCacheHandler.getExternalData(fakeInfo);

        expect(result).toEqual(data);

    });

    it("AllCreditsCacheHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: LocalCacheCreditModel[] = [];

        cacheRepository.getAllCredits = jest.fn().mockImplementation(undefined);
        cacheRepository.setCredits = jest.fn().mockImplementation((serviceId, credits) => { result = credits; });

        await allCreditsCacheHandler.updateField(fakeInfo, data);

        expect(result).toEqual(data.credits);

    });

    it("AllCreditsCacheHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            IcrcCacheMetadataErrorKey,
            IcrcCacheMetadataErrorMessage
        );

        const result = allCreditsCacheHandler.getCacheDataError(fakeInfo);

        expect(result).toEqual(data);

    });


    it("AllCreditsCacheHandler processError", async () => {
        jest.restoreAllMocks();

        const result = allCreditsCacheHandler.processError({});

        expect(result).toEqual([]);

    });
})