import { IdentifierService, ILogger, IStorage, RefreshServiceConfiguration, ReplicationConfiguration } from "@ic-wallet-kit/common";
import { IcrcReplicationManager } from "@icrc/replications";
import { AllowanceDataStorage, AssetDataStorage, ContactDataStorage, IcrcDbContext, ServiceDataStorage } from "@icrc/storage";
import { IcrcRefreshService } from "@icrc/sync";
import { AssetManagerConfiguration, TransactionManagerConfiguration } from "@icrc/types";

import { RxStorage } from "rxdb";
import Container from "typedi";

export class IcrcInitializer {

    public static build(identifierService: IdentifierService,
        rxStorage: RxStorage<any, any>,
        dataStorage: IStorage,
        logger: ILogger,
        assetManagerConfiguration: AssetManagerConfiguration,
        transactionManagerConfiguration: TransactionManagerConfiguration,
        refreshServiceConfiguration: RefreshServiceConfiguration,
        icrcReplicationConfiguration: ReplicationConfiguration,
        createIcrcCanisterFunc: any
    ) {

        const icrcDbContext = new IcrcDbContext(identifierService, rxStorage);

        const assetDataStorage = new AssetDataStorage(logger, identifierService, icrcDbContext)
        const contactDataStorage = new ContactDataStorage(logger, identifierService, icrcDbContext);
        const allowanceDataStorage = new AllowanceDataStorage(logger, identifierService, icrcDbContext);
        const serviceDataStorage = new ServiceDataStorage(logger, identifierService, icrcDbContext)


        if (!Container.has(IdentifierService)) {
            Container.set(IdentifierService, identifierService);
        }

        if (!Container.has("ILogger")) {
            Container.set("ILogger", logger);
        }

        if (!Container.has("IStorage")) {
            Container.set("IStorage", dataStorage);
        }
        if (!Container.has("RefreshServiceConfiguration")) {
            Container.set("RefreshServiceConfiguration", refreshServiceConfiguration)
        }

        Container.set(IcrcDbContext, icrcDbContext);
        Container.set("AssetManagerConfiguration", assetManagerConfiguration);
        Container.set("TransactionConfiguration", transactionManagerConfiguration);
        Container.set("IcrcReplicationConfiguration", icrcReplicationConfiguration);

        Container.set("IContactDataStorage", contactDataStorage);
        Container.set("IAssetDataStorage", assetDataStorage);
        Container.set("IServiceDataStorage", serviceDataStorage);
        Container.set("IAllowanceDataStorage", allowanceDataStorage);

        Container.set("createIcrcCanisterFunc", createIcrcCanisterFunc);
    }

    public static async init(): Promise<void> {
        const icrcDbContext = Container.get(IcrcDbContext);
        await icrcDbContext.init();

        const icrcReplicationManager = Container.get(IcrcReplicationManager);
        icrcReplicationManager.init();

        const icrcRefreshService = Container.get(IcrcRefreshService);
        icrcRefreshService.init();
    }

    public static logout() {
        Container.reset();

        if (Container.has(IdentifierService)) {
            Container.remove(IdentifierService);
        }
        if (Container.has("ILogger")) {
            Container.remove("ILogger");
        }
        if (Container.has("IStorage")) {
            Container.remove("IStorage");
        }
        if (Container.has("RefreshServiceConfiguration")) {
            Container.remove("RefreshServiceConfiguration");
        }
    }
}