
import { ILogger } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcDbContext, ServiceDataStorage } from "@icrc/storage";
import { ServiceModel } from "@icrc/types/services";

describe("ServiceDataStorage", () => {
    let serviceDataStorage: ServiceDataStorage;

    beforeEach(() => {

        const logger: ILogger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const context = new (<new () => IcrcDbContext><unknown>IcrcDbContext)() as jest.Mocked<IcrcDbContext>;

        serviceDataStorage = new ServiceDataStorage(logger, identifierService, context);

    });

    it("ServiceDataStorage:collectionName should return 'services'", () => {
        expect(serviceDataStorage.collectionName).toBe("services");
    });

    it("ServiceDataStorage:getDocumentId should return the principal", () => {
        const mockService: ServiceModel = { principal: "mock-principal" } as ServiceModel;
        expect(serviceDataStorage.getDocumentId(mockService)).toBe("mock-principal");
    });
});