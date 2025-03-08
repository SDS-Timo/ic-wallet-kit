import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { GetHplContactListHandler } from "@hpl/handlers/contacts/getHplContactListHandler/getHplContactListHandler";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { HplContactDataModel, HplRemote } from "@hpl/types";
import { LoadType } from "@ic-wallet-kit/common";

describe("Unit GetHplAssetListHandler tests", () => {
    const testData = [
        {
            name: "GetHplContactListHandler: return contact list with remotes and available remotes",
            input: {
                loadType: LoadType.Full
            },
            data: {
                hplRemotes: {
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
                storageData: [
                    {
                        principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                        name: "Test Contact",
                        remotes: [
                            {
                                name: "Test VA",
                                remoteId: "1"
                            },
                            {
                                name: "Test VA 2",
                                remoteId: "2"
                            }
                        ]

                    },


                ] as HplContactDataModel[]
            },
            result: {
                contacts: [{
                    principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    name: "Test Contact",
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
                    }],
                    remotes: [
                        {
                            assetId: "1",
                            assetLogo: "",
                            assetName: "Native toy token",
                            assetSymbol: "ABC",
                            amount: "1",
                            remoteAccountId: "1",
                            code: "043",
                            expired: 0,
                            name: "Test VA"
                        },
                        {
                            assetId: "1",
                            assetLogo: "",
                            assetName: "Native toy token",
                            assetSymbol: "ABC",
                            amount: "2",
                            remoteAccountId: "2",
                            code: "043",
                            expired: 0,
                            name: "Test VA 2"
                        }]
                }
                ]
            }
        },
        {
            name: "GetHplContactListHandler: remotes that do not match existing data",
            input: {
                loadType: LoadType.Full
            },
            data: {
                hplRemotes: {
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
                        }
                    ] as HplRemote[]
                },
                storageData: [
                    {
                        principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                        name: "Test Contact",
                        remotes: [
                            {
                                name: "Test VA",
                                remoteId: "1"
                            },
                            {
                                name: "Test VA 2",
                                remoteId: "2"
                            }
                        ]

                    },


                ] as HplContactDataModel[]
            },
            result: {
                contacts: [{
                    principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    name: "Test Contact",
                    availableRemotes: [{
                        assetId: "1",
                        assetLogo: "",
                        assetName: "Native toy token",
                        assetSymbol: "ABC",
                        amount: "1",
                        remoteAccountId: "1",
                        code: "043",
                        expired: 0
                    }],
                    remotes: [
                        {
                            assetId: "1",
                            assetLogo: "",
                            assetName: "Native toy token",
                            assetSymbol: "ABC",
                            amount: "1",
                            remoteAccountId: "1",
                            code: "043",
                            expired: 0,
                            name: "Test VA"
                        },
                        {
                            assetId: "",
                            assetLogo: "",
                            assetName: "",
                            assetSymbol: "",
                            amount: "",
                            remoteAccountId: "2",
                            code: "",
                            expired: 0,
                            name: "Test VA 2"
                        }]
                }
                ]
            }
        },
        {
            name: "GetHplContactListHandler: return contact list with an empty remotes",
            input: {
                loadType: LoadType.Full
            },
            data: {
                hplRemotes: {
                    isSuccess: true,
                    data: [] as HplRemote[]
                },
                storageData: [
                    {
                        principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                        name: "Test Contact",
                        remotes: [
                        ]
                    }
                ] as HplContactDataModel[]
            },
            result: {
                contacts: [{
                    principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    name: "Test Contact",
                    availableRemotes: [],
                    remotes: []
                }
                ]
            }
        },
        {
            name: "GetHplContactListHandler: return contact list if failure to fetch remotes",
            input: {
                loadType: LoadType.Full
            },
            data: {
                hplRemotes: {
                    isSuccess: false,
                    data: undefined
                },
                storageData: [
                    {
                        principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                        name: "Test Contact",
                        remotes: [
                        ]
                    }
                ] as HplContactDataModel[]
            },
            result: {
                contacts: [{
                    principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    name: "Test Contact",
                    availableRemotes: [],
                    remotes: []
                }
                ]
            }
        },
        {
            name: "GetHplContactListHandler: return an empty contact list if no contacts exist",
            input: {
                loadType: LoadType.Full
            },
            data: {
                hplRemotes: {
                    isSuccess: true,
                    data: [] as HplRemote[]
                },
                storageData: [] as HplContactDataModel[]
            },
            result: {
                contacts: []
            }
        }
    ]

    itForeach(testData, async (test) => {
        const getHplContactRemotesHandler = new (<new () => GetHplContactRemotesHandler><unknown>GetHplContactRemotesHandler)() as jest.Mocked<GetHplContactRemotesHandler>;
        getHplContactRemotesHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.hplRemotes));
        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        hplContactRepository.getContacts = jest.fn().mockReturnValue(Promise.resolve(test.data.storageData));
        const logger = new MockLogger();
        const getHplContactListHandler = new GetHplContactListHandler(logger, getHplContactRemotesHandler, hplContactRepository);
        await getHplContactListHandler.validate(test.input);
        const result = await getHplContactListHandler.process(test.input);
        expect(result).toEqual(test.result);

        for (let contactData of test.data.storageData) {
            expect(getHplContactRemotesHandler.handle).toHaveBeenCalledWith({
                principal: Principal.fromText(contactData.principal),
                loadType: test.input.loadType
            });
        }
    });
})
