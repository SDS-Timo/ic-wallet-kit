import { LoadType } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockAssetManagerConfiguration, mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddSubAccountContactHandler } from "@icrc/handlers";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { SubAccountId } from "@icrc/types";
import { AddSubAccountContactForm } from "@icrc/types/contacts/addSubAccountContactForm";

describe("AddSubAccountContactHandler Process Tests", () => {

    const validForm: AddSubAccountContactForm = {
        principal: mockSpenderPrincipalString(),
        ledgerAddress: mockLedgerAddress,
        subAccountName: "Test SubAccount",
        subAccountId: SubAccountId.parseFromString("0x1")
    };

    const tests: testDefinition[] = [
        {
            name: "AddSubAccountContactHandler: Successfully adds sub-account contact",
            input: { ...validForm },
            data: {
                allowanceResult: {
                    amount: BigInt(1000),
                    ledgerAddress: mockLedgerAddress,
                    subAccountId: SubAccountId.parseFromString("0x1"),
                    senderPrincipal: mockSpenderPrincipalString(),
                    expiration: BigInt(Date.now() * 1_000_000),
                },
            },
            result: {
                subAccount: {
                    name: validForm.subAccountName,
                    subAccountId: validForm.subAccountId,
                    allowance: {
                        ledgerAddress: mockLedgerAddress,
                        subAccount: SubAccountId.parseFromString("0x1"),
                        sender: mockSpenderPrincipalString(),
                        amount: BigInt(1000),
                        expiration: expect.any(String),
                    },
                },
            },
        },
        {
            name: "AddSubAccountContactHandler: No allowance for sub-account",
            input: { ...validForm },
            data: {
                allowanceResult: {
                    amount: BigInt(0),
                },
            },
            result: {
                subAccount: {
                    name: validForm.subAccountName,
                    subAccountId: validForm.subAccountId,
                    allowance: undefined,
                },
            },
        },
        {
            name: "AddSubAccountContactHandler: Fails to add sub-account contact",
            input: { ...validForm },
            data: {
                addSubAccountContact: jest.fn().mockRejectedValue(new Error("Failed to add sub-account contact")),
            },
            error: new Error("Failed to add sub-account contact"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;
        const getAllowanceHandler = new (<new () => GetIcrcAllowanceForContactCacheHandler><unknown>GetIcrcAllowanceForContactCacheHandler)() as jest.Mocked<GetIcrcAllowanceForContactCacheHandler>;
        const configuration = mockAssetManagerConfiguration;

        contactRepository.addSubAccountContact = jest.fn().mockResolvedValue(undefined);
        getAllowanceHandler.process = jest.fn().mockResolvedValue({
            amount: BigInt(0),
        });

        if (test.data?.addSubAccountContact) {
            contactRepository.addSubAccountContact = test.data.addSubAccountContact;
        }
        if (test.data?.allowanceResult) {
            getAllowanceHandler.process = jest.fn().mockResolvedValue(test.data.allowanceResult);
        }

        const handler = new AddSubAccountContactHandler(logger, configuration, contactRepository, getAllowanceHandler);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.addSubAccountContact).toHaveBeenCalledWith(test.input);
        expect(getAllowanceHandler.process).toHaveBeenCalledWith({
            senderPrincipal: test.input.principal,
            ledgerAddress: test.input.ledgerAddress,
            subAccountId: test.input.subAccountId,
            loadType: LoadType.Full,
        });

    });
});
