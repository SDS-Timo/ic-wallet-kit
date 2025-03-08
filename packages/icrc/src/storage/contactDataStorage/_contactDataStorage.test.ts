
import { ILogger } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { ContactDataStorage } from "@icrc/storage/contactDataStorage/contactDataStorage";
import { IcrcDbContext } from "@icrc/storage/database";
import { ContactModel } from "@icrc/types/contacts/contactModel";

describe("ContactDataStorage", () => {
    let contactDataStorage: ContactDataStorage;

    beforeEach(() => {
        const logger: ILogger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const context = new (<new () => IcrcDbContext><unknown>IcrcDbContext)() as jest.Mocked<IcrcDbContext>;

        contactDataStorage = new ContactDataStorage(logger, identifierService, context);
    });

    it("ContactDataStorage:collectionName should return correct collection name", () => {
        expect(contactDataStorage.collectionName).toBe("contacts");
    });

    it("ContactDataStorage:getDocumentId should return correct document ID", () => {
        const contact: ContactModel = { principal: "some-principal" } as ContactModel;
        expect(contactDataStorage.getDocumentId(contact)).toBe("some-principal");
    });
});
