import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { EditHplContactHandler } from "@hpl/handlers/contacts/editHplContactHandler/editHplContactHandler";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { HplContactDataModel, HplRemote } from "@hpl/types";
import { LoadType } from "@ic-wallet-kit/common";

describe("Unit EditHplContactHandler tests", () => {
    const testData = [
        {
            name: "EditHplContactHandler success",
            input: {
                contactName: "Test",
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                linkIds: [{
                    linkName: "Test 1",
                    remoteId: "0"
                }]
            },
            dataContact: {
                name: "Test",
                principal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                remotes: [{
                    name: "Test",
                    remoteId: "0"
                }]
            } as HplContactDataModel,
            dataContactRemotes: [{
                amount: "1",
                code: "02a0",
                expired: 0,
                assetId: "1",
                name: "",
                remoteAccountId: "0",
            }] as HplRemote[],
            result: {
                remotes: [
                    {
                        amount: "1",
                        code: "02a0",
                        expired: 0,
                        assetId: "1",
                        name: "Test 1",
                        remoteAccountId: "0"
                    }
                ]
            }
        }
    ]

    itForeach(testData, async (test) => {
        const getHplContactRemotesHandler = new (<new () => GetHplContactRemotesHandler><unknown>GetHplContactRemotesHandler)() as jest.Mocked<GetHplContactRemotesHandler>;
        getHplContactRemotesHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.dataContactRemotes))
        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        hplContactRepository.getContactById = jest.fn().mockReturnValue(Promise.resolve(test.dataContact))
        hplContactRepository.updateContact = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const logger = new MockLogger();
        const editHplContactHandler = new EditHplContactHandler(logger, hplContactRepository, getHplContactRemotesHandler);
        const result = await editHplContactHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(getHplContactRemotesHandler.process).toHaveBeenCalledWith({
            principal: test.input.principal,
            loadType: LoadType.Full
        });

        expect(hplContactRepository.getContactById).toHaveBeenCalledWith(test.input.principal.toString());

        expect(hplContactRepository.updateContact).toHaveBeenCalledWith(
            {
                principal: test.input.principal.toString(),
                name: test.input.contactName,
                remotes: test.input.linkIds.filter((l) => test.dataContactRemotes.find((d) => d.remoteAccountId === l.remoteId)).map((l) => {
                    return {
                        name: l.linkName,
                        remoteId: l.remoteId,
                    }
                })
            }
        );
    });
})
