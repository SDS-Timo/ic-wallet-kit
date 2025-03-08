import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { AddHplContactHandler } from "@hpl/handlers/contacts/addHplContactHandler/addHplContactHandler";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { LoadType } from "@ic-wallet-kit/common";

describe("Unit AddHplContactHandler tests", () => {
    const testData = [
        {
            name: "AddHplContactHandler, valid result with contact remotes",
            input: {
                contactName: "Test",
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                linkIds: [{
                    linkName: "Test 1",
                    remoteId: "0"
                },
                {
                    linkName: "Test 2",
                    remoteId: "2"
                }]
            },
            dataContactRemotes:
            {
                isSuccess: true,
                data: [{
                    amount: "1",
                    code: "02a0",
                    expired: 0,
                    assetId: "1",
                    name: "",
                    remoteAccountId: "0",
                }],
            },
            result: {
                contact: {
                    name: "Test",
                    principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                    remotes: [{
                        amount: "1",
                        assetId: "1",
                        code: "02a0",
                        expired: 0,
                        name: "Test 1",
                        remoteAccountId: "0",
                    }],
                    availableRemotes: [
                        {
                            amount: "1",
                            assetId: "1",
                            assetLogo: undefined,
                            assetName: undefined,
                            assetSymbol: undefined,
                            code: "02a0",
                            expired: 0,
                            remoteAccountId: "0",
                        },
                    ],
                }
            }
        },
        {
            name: "AddHplContactHandler, return a result with no remotes if contactRemotesResult fails",
            input: {
                contactName: "Test",
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                linkIds: [{
                    linkName: "Test 1",
                    remoteId: "0"
                }]
            },
            dataContactRemotes: { isSuccess: false, data: undefined },
            result: {
                contact: {
                    name: "Test",
                    principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                    remotes: [],
                    availableRemotes: [
                    ],
                }
            }
        },
        {
            name: "AddHplContactHandler, return a result with no remotes ",
            input: {
                contactName: "Test",
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                linkIds: [{
                    linkName: "Test 1",
                    remoteId: "0"
                }]
            },
            dataContactRemotes: { isSuccess: true, data: undefined },
            result: {
                contact: {
                    name: "Test",
                    principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                    remotes: [],
                    availableRemotes: [
                    ],
                }
            }
        }
    ]

    itForeach(testData, async (test) => {
        const getHplContactRemotesHandler = new (<new () => GetHplContactRemotesHandler><unknown>GetHplContactRemotesHandler)() as jest.Mocked<GetHplContactRemotesHandler>;
        getHplContactRemotesHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.dataContactRemotes));
        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        hplContactRepository.addContact = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const logger = new MockLogger();
        const addHplContactHandler = new AddHplContactHandler(logger, hplContactRepository, getHplContactRemotesHandler);
        const result = await addHplContactHandler.process(test.input);

        expect(result).toEqual(test.result);

        expect(getHplContactRemotesHandler.handle).toHaveBeenCalledWith({
            principal: test.input.principal,
            loadType: LoadType.Full
        });

        expect(hplContactRepository.addContact).toHaveBeenCalledWith(
            {
                principal: test.input.principal.toString(),
                name: test.input.contactName,
                remotes: test.input.linkIds.filter((l) => test.dataContactRemotes.data?.find((d) => d.remoteAccountId === l.remoteId)).map((l) => {
                    return {
                        name: l.linkName,
                        remoteId: l.remoteId,
                    }
                })
            }
        );
    });
})
