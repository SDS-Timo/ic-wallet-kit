import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { AddHplContactLinkForm } from "@hpl/forms";
import { AddHplContactRemotesHandler } from "@hpl/handlers/contacts/addHplContactRemotesHandler/addHplContactRemotesHandler";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { HplContactDataModel, HplRemote } from "@hpl/types";
import { LoadType } from "@ic-wallet-kit/common";

describe("Unit AddHplContactRemotesHandler tests", () => {
    const testData = [
        {
            name: "AddHplContactRemotesHandler success",
            input: {
                contactPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                linkIds: [{
                    linkName: "Test 1",
                    remoteId: "0"
                }]
            } as AddHplContactLinkForm,

            dataContactRemotes: [] as HplRemote[],
            contact: {
                name: "Test",
                principal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                remotes: []
            } as HplContactDataModel,
            result: {
                links: []
            }
        },
        {
            name: "AddHplContactRemotesHandler success",
            input: {
                contactPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                linkIds: [{
                    linkName: "Test 1",
                    remoteId: "1"
                }]
            } as AddHplContactLinkForm,

            dataContactRemotes: [{
                amount: "2",
                assetId: "2",
                assetLogo: "",
                assetName: "Test Name",
                assetSymbol: "Test Symbol",
                code: "043",
                name: "",
                remoteAccountId: "1"
            }] as HplRemote[],
            contact: {
                name: "Test",
                principal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                remotes: []
            } as HplContactDataModel,
            result: {
                links: [{
                    amount: "2",
                    assetId: "2",
                    assetLogo: "",
                    assetName: "Test Name",
                    assetSymbol: "Test Symbol",
                    code: "043",
                    name: "Test 1",
                    remoteAccountId: "1",
                }]
            }
        }
    ]

    itForeach(testData, async (test) => {
        const getHplContactRemotesHandler = new (<new () => GetHplContactRemotesHandler><unknown>GetHplContactRemotesHandler)() as jest.Mocked<GetHplContactRemotesHandler>;
        getHplContactRemotesHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.dataContactRemotes))
        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        hplContactRepository.addContactRemotes = jest.fn().mockReturnValue(Promise.resolve(undefined))
        hplContactRepository.getContactById = jest.fn().mockReturnValue(Promise.resolve(test.contact))
        const logger = new MockLogger();
        const addHplContactRemotesHandler = new AddHplContactRemotesHandler(logger, hplContactRepository, getHplContactRemotesHandler);
        const result = await addHplContactRemotesHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(getHplContactRemotesHandler.process).toHaveBeenCalledWith({
            principal: test.input.contactPrincipal,
            loadType: LoadType.Full
        });

        expect(hplContactRepository.addContactRemotes).toHaveBeenCalledWith(
            test.input.contactPrincipal.toString(),
            test.input.linkIds.filter((l) => test.dataContactRemotes.find((d) => d.remoteAccountId === l.remoteId)).map((l) => {
                return {
                    name: l.linkName,
                    remoteId: l.remoteId,
                }
            })
        );
    });

})
