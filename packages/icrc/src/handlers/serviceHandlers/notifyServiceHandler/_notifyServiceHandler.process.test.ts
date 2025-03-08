import { LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { NotifyServiceHandler } from "@icrc/handlers";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";
import { NotifyForm } from "@icrc/types/forms";
import { Icrc84ActorWrapper } from "@icrc/wrappers";


describe("NotifyServiceHandler Process Tests", () => {
    const validForm: NotifyForm = {
        servicePrincipal: "mock-service-principal",
        ledgerAddress: mockLedgerAddress
    };

    const tests: testDefinition[] = [
        {
            name: "NotifyServiceHandler: Successfully notifies service",
            input: { ...validForm },
            data: {
                assetCredit: {
                    ledgerAddress: "mock-ledger-address",
                    credit: BigInt(1000),
                },
                assetDeposit: {
                    serviceAssetDeposit: BigInt(500),
                },
            },
            result: {
                servicePrincipal: "mock-service-principal",
                ledgerAddress: "mock-ledger-address",
                credit: BigInt(1000),
                deposit: BigInt(500),
            },
        },
        {
            name: "NotifyServiceHandler: Handles failure during notification",
            input: { ...validForm },
            error: new Error("Notification failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const identifierService = mockAnonymousIdentifierService();
        const serviceAssetCreditHandler = new (<new () => ServiceAssetCacheCreditHandler><unknown>ServiceAssetCacheCreditHandler)() as jest.Mocked<ServiceAssetCacheCreditHandler>;
        const serviceAssetDepositHandler = new (<new () => ServiceAssetDepositHandler><unknown>ServiceAssetDepositHandler)() as jest.Mocked<ServiceAssetDepositHandler>;

        const icrc84ActorWrapper = new (<new () => Icrc84ActorWrapper><unknown>Icrc84ActorWrapper)() as jest.Mocked<Icrc84ActorWrapper>;
        Icrc84ActorWrapper.create = jest.fn().mockReturnValue(icrc84ActorWrapper);

        if (test.error) {
            icrc84ActorWrapper.notify = jest.fn().mockRejectedValue(test.error);
        } else {
            icrc84ActorWrapper.notify = jest.fn().mockResolvedValue(undefined);
        }

        serviceAssetCreditHandler.process = jest.fn().mockResolvedValue(test.data?.assetCredit ?? {});
        serviceAssetDepositHandler.process = jest.fn().mockResolvedValue(test.data?.assetDeposit ?? {});

        const handler = new NotifyServiceHandler(logger, identifierService, serviceAssetCreditHandler, serviceAssetDepositHandler);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(serviceAssetCreditHandler.process).toHaveBeenCalledWith({
            servicePrincipal: test.input.servicePrincipal,
            ledgerAddress: test.input.ledgerAddress,
            loadType: LoadType.Full,
        });
        expect(serviceAssetDepositHandler.process).toHaveBeenCalledWith({
            servicePrincipal: test.input.servicePrincipal,
            ledgerAddress: test.input.ledgerAddress,
            loadType: LoadType.Full,
        });

    });
});
