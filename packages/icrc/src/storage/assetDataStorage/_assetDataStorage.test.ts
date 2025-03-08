
import { ILogger } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { AssetDataStorage, IcrcDbContext } from "@icrc/storage";
import { WalletAsset } from "@icrc/types";

describe("AssetDataStorage", () => {
    let assetDataStorage: AssetDataStorage;

    beforeEach(() => {

        const logger: ILogger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const context = new (<new () => IcrcDbContext><unknown>IcrcDbContext)() as jest.Mocked<IcrcDbContext>;

        assetDataStorage = new AssetDataStorage(logger, identifierService, context);
    });

    it("AssetDataStorage:collectionName should return 'assets'", () => {
        expect(assetDataStorage.collectionName).toBe("assets");
    });

    it("AssetDataStorage:getDocumentId should return ledgerAddress as document ID", () => {
        const mockAsset: WalletAsset = {
            ledgerAddress: "mock-ledger-address"
        } as WalletAsset;
        expect(assetDataStorage.getDocumentId(mockAsset)).toBe("mock-ledger-address");
    });
});