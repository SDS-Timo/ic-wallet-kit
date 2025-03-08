import { Principal } from "@dfinity/principal";
import { CacheDataError, LoadType } from "@ic-wallet-middleware/common";
import { mockPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcCacheMetadataErrorKey, IcrcCacheMetadataErrorMessage } from "@icrc/errors";
import { SupportedAssetsCacheHandler, SupportedAssetsInfo, SupportedAssetsResult } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/supportedAssetsCacheHandler/supportedAssetsCacheHandler";
import { ServiceLocalCache } from "@icrc/repositories";
import { LocalCacheServiceModel } from "@icrc/types";
import { Icrc84ActorWrapper } from "@icrc/wrappers";

describe("Unit SupportedAssetsCacheHandler tests", () => {

    const cacheRepository = new (<new () => ServiceLocalCache><unknown>ServiceLocalCache)() as jest.Mocked<ServiceLocalCache>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const supportedAssetsCacheHandler = new SupportedAssetsCacheHandler(logger, identifierService, cacheRepository);

    const data: LocalCacheServiceModel = {
        servicePrincipal: "xxxx",
        assets: [
            {
                assetDetail: { allowanceFee: 1n, depositFee: 2n, withdrawalFee: 3n },
                ledgerAddress: "ledgerAddress1",
                deposit: 555n
            },
            {
                assetDetail: { allowanceFee: 21n, depositFee: 22n, withdrawalFee: 23n },
                ledgerAddress: "ledgerAddress2",
                deposit: 2555n
            }
        ]
    };


    const fakeInfo = { servicePrincipal: mockPrincipal } as SupportedAssetsInfo;

    it("SupportedAssetsCacheHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        const expectedCache = {
            principals: data.assets.map((a) => a.ledgerAddress)
        };


        cacheRepository.getService = jest.fn().mockReturnValue(data);

        const result = await supportedAssetsCacheHandler.getLocalCacheData(fakeInfo);

        expect(result).toEqual(expectedCache);

    });

    it("ServiceAssetCacheCreditHandler getLoadForceType", async () => {
        jest.restoreAllMocks();

        const result = supportedAssetsCacheHandler.getLoadForceType();
        await supportedAssetsCacheHandler.validate(fakeInfo);

        expect(result).toEqual([LoadType.Full]);
    });

    it("SupportedAssetsCacheHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;

        let serviceData: Principal[] = [
            Principal.anonymous(),
            Principal.fromHex("0x3")
        ]

        icrc84ActorWrapper.getSupportedAssets = jest.fn().mockReturnValue(Promise.resolve(serviceData));

        Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);

        const result = await supportedAssetsCacheHandler.getExternalData(fakeInfo);

        const expectedService = {
            principals: serviceData.map((a) => a.toText())
        };

        expect(result).toEqual(expectedService);

    });

    it("SupportedAssetsCacheHandler updateField getService undefined", async () => {
        jest.restoreAllMocks();


        let result: SupportedAssetsResult = {} as SupportedAssetsResult;

        cacheRepository.getService = jest.fn().mockReturnValue(undefined);
        cacheRepository.setService = jest.fn().mockImplementation((service) => { result = service; });

        const expectedUpdate = {
            principals: data.assets.map((a) => a.ledgerAddress)
        };

        await supportedAssetsCacheHandler.updateField(fakeInfo, expectedUpdate);

        const expectedService = {
            servicePrincipal: mockPrincipal,
            assets: [
                { ledgerAddress: 'ledgerAddress1', assetDetail: undefined, deposit: 0n },
                { ledgerAddress: 'ledgerAddress2', assetDetail: undefined, deposit: 0n }
            ]
        }

        expect(result).toEqual(expectedService);

    });

    it("SupportedAssetsCacheHandler updateField getService return value", async () => {
        jest.restoreAllMocks();


        let result: SupportedAssetsResult = {} as SupportedAssetsResult;

        const services = {
            servicePrincipal: fakeInfo.servicePrincipal,
            assets: [
                { ledgerAddress: 'ledgerAddress1', assetDetail: "assetDetail1", deposit: 0n },
                { ledgerAddress: 'ledgerAddress2', assetDetail: "assetDetail2", deposit: 0n }
            ]
        }

        cacheRepository.getService = jest.fn().mockReturnValue(services);
        cacheRepository.setService = jest.fn().mockImplementation((service) => { result = service; });

        const expectedUpdate = {
            principals: data.assets.map((a) => a.ledgerAddress)
        };

        await supportedAssetsCacheHandler.updateField(fakeInfo, expectedUpdate);

        const expectedService = {
            servicePrincipal: mockPrincipal,
            assets: [
                { ledgerAddress: 'ledgerAddress1', assetDetail: "assetDetail1", deposit: 0n },
                { ledgerAddress: 'ledgerAddress2', assetDetail: "assetDetail2", deposit: 0n }
            ]
        }

        expect(result).toEqual(expectedService);

    });


    it("SupportedAssetsCacheHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            IcrcCacheMetadataErrorKey,
            IcrcCacheMetadataErrorMessage
        );

        const result = supportedAssetsCacheHandler.getCacheDataError(fakeInfo);

        expect(result).toEqual(data);

    });


    it("SupportedAssetsCacheHandler processError", async () => {
        jest.restoreAllMocks();

        const result = supportedAssetsCacheHandler.processError({});

        expect(result).toEqual([]);

    });

})