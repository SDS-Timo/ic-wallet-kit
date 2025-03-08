import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { CheckLinkCodeForm } from "@hpl/forms";
import { CheckLinkCodeHandler } from "@hpl/handlers/virtualAccounts/checkLinkCodeHandler/checkLinkCodeHandler";
import { IngressActorWrapper, OwnersActorWrapper } from "@hpl/hplWrappers";
import { HplAssetRepository } from "@hpl/repositories";
import { HplAssetDataModel } from "@hpl/types";

describe("Unit CheckLinCodeHandler process tests", () => {

    const form: CheckLinkCodeForm = {
        linkCode: "043"
    };

    const tests = [
        {
            name: "CheckLinCodeHandler: Invalid code",
            input: {
                linkCode: "0"
            },
            data: {},
            result: {
                error: "Invalid code",
                remoteInfo: undefined
            }
        },
        {
            name: "CheckLinCodeHandler: Cannot convert code to a BigInt",
            input: {
                linkCode: "0zx"
            },
            data: {},
            result: {
                error: "Cannot convert 0xz to a BigInt",
                remoteInfo: undefined
            }
        },
        {
            name: "CheckLinCodeHandler: Invalid ownerId",
            input: form,
            data: {
                owner: undefined
            },
            result: {
                error: "Invalid ownerId",
                remoteInfo: undefined
            }
        },
        {
            name: "CheckLinCodeHandler: RemoteInfo not found",
            input: form,
            data: {
                owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                remoteAccountInfo: []
            },
            result: {
                error: "RemoteInfo not found",
                remoteInfo: undefined
            }
        },
        {
            name: "CheckLinCodeHandler: RemoteState not found",
            input: form,
            data: {
                owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                remoteAccountInfo: [[[[Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe")], 3n], { ft: 6n }]],
                remoteState: {
                    remoteAccounts: []
                },
            },
            result: {
                error: "RemoteState not found",
                remoteInfo: undefined
            }
        },
        {
            name: "CheckLinCodeHandler: remoteInfo valid",
            input: form,
            data:
            {
                owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                remoteAccountInfo: [[[[Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe")], 3n], { ft: 6n }]],
                remoteState: {
                    remoteAccounts: [{
                        remotePrincipal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                        remoteAccountId: 3n,
                        accountState: { ft: 2n },
                        time: 0n
                    }]
                },
                asset: {
                    assetName: "Test",
                    assetSymbol: "Test",
                    id: "5",
                    logo: "",
                    name: "Test",
                    symbol: "Test"
                } as HplAssetDataModel,

            },
            result:
            {
                error: "",
                owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                remoteInfo: {
                    amount: "2",
                    assetId: "6",
                    assetLogo: "",
                    assetName: "Test",
                    assetSymbol: "Test",
                    code: "043",
                    expired: 0,
                    name: "",
                    remoteAccountId: "3",
                }
            }
        },
        {
            name: "CheckLinCodeHandler: remoteInfo valid",
            input: form,
            data:
            {
                owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                remoteAccountInfo: [[[[Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe")], 3n], { ft: 6n }]],
                remoteState: {
                    remoteAccounts: [{
                        remotePrincipal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                        remoteAccountId: 3n,
                        accountState: { ft: 2n },
                        time: 0n
                    }]
                },
                asset: {
                    assetName: "Test",
                    assetSymbol: "Test",
                    id: "5",
                    logo: "",
                    name: "",
                    symbol: ""
                } as HplAssetDataModel,

            },
            result:
            {
                error: "",
                owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                remoteInfo: {
                    amount: "2",
                    assetId: "6",
                    assetLogo: "",
                    assetName: "Test",
                    assetSymbol: "Test",
                    code: "043",
                    expired: 0,
                    name: "",
                    remoteAccountId: "3",
                }
            }
        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");
        const hplAssetRepository = new (<new () => HplAssetRepository><unknown>HplAssetRepository)() as jest.Mocked<HplAssetRepository>;
        hplAssetRepository.getAssetById = jest.fn().mockResolvedValue(Promise.resolve(test.data.asset))

        const ownersActorWrapper = new (<new () => OwnersActorWrapper><unknown>OwnersActorWrapper)() as jest.Mocked<OwnersActorWrapper>;
        OwnersActorWrapper.create = jest.fn().mockReturnValue(ownersActorWrapper);

        ownersActorWrapper.get = test.data.owner
            ? jest.fn().mockResolvedValue(Promise.resolve(test.data.owner))
            : jest.fn().mockRejectedValue("Test")

        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;
        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);

        ingressActorWrapper.remoteAccountInfo = jest.fn().mockResolvedValue(Promise.resolve(test.data.remoteAccountInfo));
        ingressActorWrapper.getState = jest.fn().mockResolvedValue(Promise.resolve(test.data.remoteState));

        const checkLinCodeHandler = new CheckLinkCodeHandler(logger,
            identifierService,
            mockCanisterService,
            hplAssetRepository
        );

        const result = await checkLinCodeHandler.process(test.input);

        expect(result).toEqual(test.result);

        if (!test.result.error) {
            expect(hplAssetRepository.getAssetById).toHaveBeenCalledWith(
                "6"
            );
        }
    });

});