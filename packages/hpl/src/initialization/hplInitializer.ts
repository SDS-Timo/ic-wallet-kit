import { HplReplicationManager } from "@hpl/replications";
import { HplDataCacheRepository, HplDictionaryCacheRepository, HplMintCacheRepository, HplOwnerCacheRepository, HplStateCacheRepository } from "@hpl/repositories";
import { CanisterService } from "@hpl/service";
import { HplAccountDataStorage, HplAssetDataStorage, HplContactDataStorage, HplDbContext, HplVirtualAccountDataStorage } from "@hpl/storage";
import { HplRefreshService } from "@hpl/sync";
import { IdentifierService, ILogger, IStorage, RefreshServiceConfiguration, ReplicationConfiguration } from "@ic-wallet-middleware/common";

import { RxStorage } from "rxdb";
import Container from "typedi";

export class HplInitializer {

    public static build(identifierService: IdentifierService,
        rxStorage: RxStorage<any, any>,
        dataStorage: IStorage,
        logger: ILogger,
        refreshServiceConfiguration: RefreshServiceConfiguration,
        hplReplicationConfiguration: ReplicationConfiguration,
        canisterService: CanisterService,
        createHplCanisterFunc: any
    ) {

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
            Container.set("RefreshServiceConfiguration", refreshServiceConfiguration);
        }

        Container.set(CanisterService, canisterService);

        const hplDbContext = new HplDbContext(identifierService, rxStorage);

        const hplDataCacheRepository = new HplDataCacheRepository(logger, identifierService, dataStorage);

        const hplAssetDataStorage = new HplAssetDataStorage(logger, identifierService, hplDbContext);
        const hplAccountDataStorage = new HplAccountDataStorage(logger, identifierService, hplDbContext);
        const hplVirtualAccountDataStorage = new HplVirtualAccountDataStorage(logger, identifierService, hplDbContext);
        const hplContactDataStorage = new HplContactDataStorage(logger, identifierService, hplDbContext);

        const hplStateCacheRepository = new HplStateCacheRepository(logger, identifierService, dataStorage);
        const hplDictionaryCacheRepository = new HplDictionaryCacheRepository(logger, identifierService, dataStorage);
        const hplOwnerCacheRepository = new HplOwnerCacheRepository(logger, identifierService, dataStorage);
        const hplMintCacheRepository = new HplMintCacheRepository(logger, identifierService, dataStorage);

        Container.set(HplDbContext, hplDbContext);
        Container.set("IHplAssetDataStorage", hplAssetDataStorage);
        Container.set("IHplAccountDataStorage", hplAccountDataStorage);
        Container.set("IHplVirtualAccountDataStorage", hplVirtualAccountDataStorage);
        Container.set("IHplContactDataStorage", hplContactDataStorage);
        Container.set("IHplDataCacheRepository", hplDataCacheRepository);
        Container.set("IHplStateCacheRepository", hplStateCacheRepository);
        Container.set("IHplOwnerCacheRepository", hplOwnerCacheRepository);
        Container.set("IHplDictionaryCacheRepository", hplDictionaryCacheRepository);
        Container.set("IHplMintCacheRepository", hplMintCacheRepository);
        Container.set("HplReplicationConfiguration", hplReplicationConfiguration);
        Container.set("createHplCanisterFunc", createHplCanisterFunc);
    }

    public static async init(): Promise<void> {
        const hplDbContext = Container.get(HplDbContext);
        await hplDbContext.init();

        const hplReplicationManager = Container.get(HplReplicationManager);
        hplReplicationManager.init();

        const hplRefreshService = Container.get(HplRefreshService);
        hplRefreshService.init();
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