import { LoadType, ValidationError } from "@ic-wallet-kit/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockAssetManagerConfiguration, mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { GetListContactHandler } from "@icrc/handlers/contactHandlers/getListContactHandler/getListContactHandler";
import { GetIcrcAllowanceForContactCacheHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/allowances/getIcrcAllowanceForContactCacheHandler/getIcrcAllowanceForContactCacheHandler";
import { AssetRepository } from "@icrc/repositories/persists/assetRepository/assetRepository";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { GetListContactForm } from "@icrc/types/contacts/getListContactForm";

describe("GetListContactHandler Process Tests", () => {
    const validForm: GetListContactForm = {
        loadType: LoadType.Quick,
    };

    const tests: testDefinition[] = [
        {
            name: "GetListContactHandler: Successfully retrieves contacts with allowances",
            input: { ...validForm },
            data: {
                contacts: [
                    {
                        principal: mockSpenderPrincipalString(),
                        name: "Test Contact",
                        assets: [
                            {
                                ledgerAddress: mockLedgerAddress,
                                subAccounts: [
                                    { name: "SubAccount1", subAccountId: "0x1" },
                                ],
                            },
                        ],
                    },
                ],
                tokens: [
                    { ledgerAddress: mockLedgerAddress, symbol: "MOCK" },
                ],
                allowanceResult: {
                    amount: BigInt(1000),
                    ledgerAddress: mockLedgerAddress,
                    subAccountId: "0x1",
                    senderPrincipal: mockSpenderPrincipalString(),
                    expiration: BigInt(Date.now() * 1_000_000),
                },
            },
            result: {
                contacts: [
                    {
                        principal: mockSpenderPrincipalString(),
                        name: "Test Contact",
                        hasAllowance: true,
                        assets: [
                            {
                                ledgerAddress: mockLedgerAddress,
                                symbol: "MOCK",
                                subAccounts: [
                                    {
                                        name: "SubAccount1",
                                        subAccountId: expect.any(Object),
                                        allowance: {
                                            ledgerAddress: mockLedgerAddress,
                                            subAccount: "0x1",
                                            sender: mockSpenderPrincipalString(),
                                            amount: BigInt(1000),
                                            expiration: expect.any(String),
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
        {
            name: "GetListContactHandler: Successfully retrieves contacts with out allowances",
            input: { ...validForm },
            data: {
                contacts: [
                    {
                        principal: mockSpenderPrincipalString(),
                        name: "Test Contact",
                        assets: [
                            {
                                ledgerAddress: mockLedgerAddress,
                                subAccounts: [
                                    { name: "SubAccount1", subAccountId: "0x1" },
                                ],
                            },
                        ],
                    },
                ],
                tokens: [
                    { ledgerAddress: mockLedgerAddress, symbol: "MOCK" },
                ],
                allowanceResult: {
                    amount: BigInt(0),
                    ledgerAddress: mockLedgerAddress,
                    subAccountId: "0x1",
                    senderPrincipal: mockSpenderPrincipalString(),
                    expiration: BigInt(Date.now() * 1_000_000),
                },
            },
            result: {
                contacts: [
                    {
                        principal: mockSpenderPrincipalString(),
                        name: "Test Contact",
                        hasAllowance: false,
                        assets: [
                            {
                                ledgerAddress: mockLedgerAddress,
                                symbol: "MOCK",
                                subAccounts: [
                                    {
                                        name: "SubAccount1",
                                        subAccountId: expect.any(Object),
                                        allowance: undefined
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
        {
            name: "GetListContactHandler: Throws error if asset not found",
            input: { ...validForm },
            data: {
                contacts: [
                    {
                        principal: mockSpenderPrincipalString(),
                        name: "Test Contact",
                        assets: [
                            {
                                ledgerAddress: "missing-ledger-address",
                                subAccounts: [
                                    { name: "SubAccount1", subAccountId: "0x1" },
                                ],
                            },
                        ],
                    },
                ],
                tokens: [],
            },
            error: new ValidationError("asset.contact.not.found", "", "Asset Not Found"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const configuration = mockAssetManagerConfiguration;
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const getAllowanceHandler = new (<new () => GetIcrcAllowanceForContactCacheHandler><unknown>GetIcrcAllowanceForContactCacheHandler)() as jest.Mocked<GetIcrcAllowanceForContactCacheHandler>;

        contactRepository.getContacts = jest.fn().mockResolvedValue(test.data?.contacts ?? []);
        assetRepository.getTokensOrDefault = jest.fn().mockResolvedValue(test.data?.tokens ?? []);
        getAllowanceHandler.process = jest.fn().mockResolvedValue(test.data?.allowanceResult ?? { amount: BigInt(0) });

        const handler = new GetListContactHandler(logger, configuration, contactRepository, assetRepository, getAllowanceHandler);

        await handler.validate(test.input);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

    });
});
