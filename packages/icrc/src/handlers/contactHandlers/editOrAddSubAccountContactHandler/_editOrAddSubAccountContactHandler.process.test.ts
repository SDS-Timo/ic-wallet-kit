import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditOrAddSubAccountContactHandler } from "@icrc/handlers/contactHandlers/editOrAddSubAccountContactHandler/editOrAddSubAccountContactHandler";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AddSubAccountContactForm, SubAccountId } from "@icrc/types";


describe("EditOrAddSubAccountContactHandler Process Tests", () => {
    const mockLedgerAddress = "mock-ledger-address";
    const mockPrincipal = "mock-principal";

    const validForm: AddSubAccountContactForm = {
        principal: mockPrincipal,
        ledgerAddress: mockLedgerAddress,
        subAccountName: "Test SubAccount",
        subAccountId: SubAccountId.parseFromString("0x1")
    };

    const tests: testDefinition[] = [
        {
            name: "EditOrAddSubAccountContactHandler: Adds a new sub-account contact",
            input: { ...validForm },
            data: {
                contact: null,
                contactAsset: {
                    ledgerAddress: mockLedgerAddress,
                    subAccounts: [
                        {
                            name: "xxxx",
                            subAccountId: "0x1"
                        }
                    ]
                },
                addSubAccountContact: jest.fn().mockResolvedValue(undefined),
            },
            result: {},
        },
        {
            name: "EditOrAddSubAccountContactHandler: Updates an existing sub-account contact",
            input: { ...validForm, subAccountId: SubAccountId.parseFromString("0x2") },
            data: {
                contact: { ledgerAddress: mockLedgerAddress, subAccounts: [{ subAccountId: "0x1", name: "Old SubAccount" }] },
                contactAsset: undefined,
                contactAssetIfNotExists: {
                    ledgerAddress: mockLedgerAddress,
                    subAccounts: [
                        {
                            name: "xxxx",
                            subAccountId: "0x1"
                        }
                    ]
                },
                updateSubAccountContact: jest.fn().mockResolvedValue(undefined),
            },
            result: {},
        },
        {
            name: "EditOrAddSubAccountContactHandler: Fails to add sub-account contact",
            input: { ...validForm },
            data: {
                contact: null,
                contactAsset: {
                    ledgerAddress: mockLedgerAddress,
                    subAccounts: [
                        {
                            name: "xxxx",
                            subAccountId: "0x3"
                        }
                    ]
                },
                addSubAccountContact: jest.fn().mockRejectedValue(new Error("Failed to add sub-account contact")),
            },
            error: new Error("Failed to add sub-account contact"),
        }
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;
        const getIcrcAllowanceForContactHandler = new (<new () => GetIcrcAllowanceForContactCacheHandler><unknown>GetIcrcAllowanceForContactCacheHandler)() as jest.Mocked<GetIcrcAllowanceForContactCacheHandler>;

        contactRepository.getContactByPrincipal = jest.fn().mockResolvedValue(test.data?.contact);
        contactRepository.getContactAssetOrDefault = jest.fn().mockReturnValue(test.data?.contactAsset);
        contactRepository.getContactAsset = jest.fn().mockReturnValue(test.data?.contactAssetIfNotExists);
        contactRepository.addSubAccountContact = jest.fn().mockResolvedValue(undefined);
        contactRepository.updateSubAccountContact = jest.fn().mockResolvedValue(undefined);
        contactRepository.addAssetContact = jest.fn().mockResolvedValue(undefined);
        getIcrcAllowanceForContactHandler.process = jest.fn().mockResolvedValue(undefined);

        if (test.data?.addSubAccountContact) {
            contactRepository.addSubAccountContact = test.data.addSubAccountContact;
        }
        if (test.data?.updateSubAccountContact) {
            contactRepository.updateSubAccountContact = test.data.updateSubAccountContact;
        }

        const handler = new EditOrAddSubAccountContactHandler(logger, contactRepository, getIcrcAllowanceForContactHandler);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        if (test.data?.contactAsset?.subAccounts) {
            expect(contactRepository.updateSubAccountContact).toHaveBeenCalledWith({
                ledgerAddress: test.input.ledgerAddress,
                principal: test.input.principal,
                oldSubAccountId: test.input.subAccountId,
                newSubAccountName: test.input.subAccountName,
                newSubAccountId: test.input.subAccountId,
            });
        } else {
            expect(contactRepository.addSubAccountContact).toHaveBeenCalledWith(test.input);
        }

    });
});
