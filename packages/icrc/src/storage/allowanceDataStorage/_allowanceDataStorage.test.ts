
import { ILogger } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcDbContext } from "@icrc/storage";
import { AllowanceDataStorage } from "@icrc/storage/allowanceDataStorage/allowanceDataStorage";
import { AllowanceStorageModel } from "@icrc/types/allowances/allowanceStorageModel";


describe("AllowanceDataStorage", () => {
    let storage: AllowanceDataStorage;

    beforeEach(() => {

        const logger: ILogger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const context = new (<new () => IcrcDbContext><unknown>IcrcDbContext)() as jest.Mocked<IcrcDbContext>;

        storage = new AllowanceDataStorage(logger, identifierService, context);
    });

    it("AllowanceDataStorage:collectionName should return correct collection name", () => {
        expect(storage.collectionName).toBe("allowances");
    });

    it("AllowanceDataStorage:getDocumentId should return correct document ID", () => {
        const doc: AllowanceStorageModel = {
            spenderPrincipal: "spender-123",
            ledgerAddress: "ledger-456",
            subAccountId: "sub-789",
            spenderSubId: "sub-000"
        };

        const documentId = storage.getDocumentId(doc);
        expect(documentId).toBe("spender-123_ledger-456_sub-789_sub-000");
    });
});
