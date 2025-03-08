import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FormResult, IdentifierService } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { NotifyServiceHandler } from "@icrc/handlers/serviceHandlers/notifyServiceHandler/notifyServiceHandler";
import { ServiceAssetCacheCreditHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetCreditCacheHandler/ServiceAssetCacheCreditHandler";
import { ServiceAssetDepositHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/services/serviceAssetDepositHandler/serviceAssetDepositHandler";

describe("Unit NotifyServiceHandler tests", () => {
    const testData = [
        {
            name: "Notify",
            input: {
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                servicePrincipal: "pmr6h-yaaaa-aaaao-a3myq-cai",
            },
            data: {
                credit: {
                    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    credit: BigInt(1000000)
                },
                debit: {
                    serviceAssetDeposit: BigInt(0)
                }
            },
            result: FormResult.error([{
                fieldName: "",
                localizationKey: "default.error.message",
                message: "could not perform remote call"
            }])
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();
            const identifierService = new (<new () => IdentifierService><unknown>IdentifierService)() as jest.Mocked<IdentifierService>;
            const serviceAssetCreditHandler = new (<new () => ServiceAssetCacheCreditHandler><unknown>ServiceAssetCacheCreditHandler)() as jest.Mocked<ServiceAssetCacheCreditHandler>;
            serviceAssetCreditHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.credit))
            const serviceAssetDepositHandler = new (<new () => ServiceAssetDepositHandler><unknown>ServiceAssetDepositHandler)() as jest.Mocked<ServiceAssetDepositHandler>;
            serviceAssetDepositHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.debit))
            identifierService.getAgent = jest.fn().mockReturnValue(new HttpAgent())
            identifierService.getPrincipal = jest.fn().mockReturnValue(Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"))
            const logger = new MockLogger();
            const notifyServiceHandler = new NotifyServiceHandler(logger,
                identifierService,
                serviceAssetCreditHandler,
                serviceAssetDepositHandler
            );
            const result = await notifyServiceHandler.handle(test.input);
            expect(result).toEqual(test.result);
        });
    }

})