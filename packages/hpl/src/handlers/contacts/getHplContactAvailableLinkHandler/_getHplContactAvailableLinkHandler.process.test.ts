import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { GetHplContactAvailableLinkHandler } from "@hpl/handlers/contacts/getHplContactAvailableLinkHandler/getHplContactAvailableLinkHandler";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplRemote } from "@hpl/types";
import { LoadType } from "@ic-wallet-kit/common";

describe("Unit GetHplContactAvailableLinkHandler tests", () => {
    const testData = [
        {
            name: "GetHplContactAvailableLinkHandler: return available remotes",
            input: {
                principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                loadType: LoadType.Full
            },
            data: {
                isSuccess: true,
                data: [
                    {
                        assetName: "Native toy token",
                        assetSymbol: "ABC",
                        assetId: "1",
                        amount: "1",
                        assetLogo: "",
                        name: "Test",
                        remoteAccountId: "1",
                        code: "043",
                        expired: 0
                    },
                    {
                        assetName: "Native toy token",
                        assetSymbol: "ABC",
                        assetId: "1",
                        amount: "2",
                        assetLogo: "",
                        name: "Test",
                        remoteAccountId: "2",
                        code: "043",
                        expired: 0
                    },
                    {
                        assetName: "Native toy token",
                        assetSymbol: "ABC",
                        assetId: "1",
                        amount: "1",
                        assetLogo: "",
                        name: "Test",
                        remoteAccountId: "3",
                        code: "043",
                        expired: 0
                    }
                ] as HplRemote[]
            },
            result: {
                availableRemotes: [{
                    assetId: "1",
                    assetLogo: "",
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    amount: "1",
                    remoteAccountId: "1",
                    code: "043",
                    expired: 0
                },
                {
                    assetId: "1",
                    assetLogo: "",
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    amount: "2",
                    remoteAccountId: "2",
                    code: "043",
                    expired: 0
                },
                {
                    assetId: "1",
                    assetLogo: "",
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    amount: "1",
                    remoteAccountId: "3",
                    code: "043",
                    expired: 0
                }]
            }
        },
        {
            name: "GetHplContactAvailableLinkHandler: an empty list if no remotes are available",
            input: {
                principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                loadType: LoadType.Full
            },
            data: {
                isSuccess: true,
                data: [],
            },
            result: {
                availableRemotes: []
            }
        },
        {
            name: "GetHplContactAvailableLinkHandler:  failure to fetch remotes gracefully",
            input: {
                principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                loadType: LoadType.Full
            },
            data: {
                isSuccess: false,
                data: undefined,
            },
            result: {
                availableRemotes: []
            }
        }
    ]

    itForeach(testData, async (test) => {
        const getHplContactRemotesHandler = new (<new () => GetHplContactRemotesHandler><unknown>GetHplContactRemotesHandler)() as jest.Mocked<GetHplContactRemotesHandler>;
        getHplContactRemotesHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data));
        const logger = new MockLogger();
        const getHplContactAvailableLinkHandler = new GetHplContactAvailableLinkHandler(logger, getHplContactRemotesHandler);
        const result = await getHplContactAvailableLinkHandler.process(test.input);
        expect(result).toEqual(test.result);
    });
})
