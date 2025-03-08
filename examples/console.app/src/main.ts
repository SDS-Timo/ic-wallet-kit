import { LocalDataStorage } from "@app/storages/localDataStorage";
import { consoleKeyOutput, consoleOutputJson } from "@app/utils/consoleOutput";
import { IdentifierService, ILogger, IStorage, RefreshServiceConfiguration, ReplicationConfiguration } from "@ic-wallet-middleware/common";
import {
    CanisterService,
    HplInitializer
} from "@ic-wallet-middleware/hpl";
import {
    IcrcInitializer
} from "@ic-wallet-middleware/icrc";
import "reflect-metadata";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import Container from "typedi";
import { createActor as hplCreator } from "./database/candid/hpl";
import { createActor as icrcCreator } from "./database/candid/icrc";
import { AllowanceConsoleStorage } from "./storages/allowanceConsoleStorage";
import { AssetConsoleStorage } from "./storages/assetConsoleStorage";
import { ContactConsoleStorage } from "./storages/contactConsoleStorage";
import { ServiceConsoleStorage } from "./storages/serviceConsoleStorage";


export class App {

    tokenMarketUrl: string = "https://nftpkg.com/api/icpcoins/list";
    ethMarketUrl = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";

    icpUrl = "https://rosetta-api.internetcomputer.org";
    ogyUrl = "https://rosetta-ogy.origyn.ch";
    icpNetwork = "00000000000000020101";
    ogyNetwork = "00000000012000b90101";
    icpBlockchain = "Internet Computer";
    ogyBlockchain = "ORIGYN Foundation";


    public replicaCanister: any;

    public assetManagerConfiguration = {
        ethMarketUrl: this.ethMarketUrl,
        tokenMarketUrl: this.tokenMarketUrl,
        defaultDateTimeFormat: "MM/DD/YYYY HH:mm"
    };

    public canisterService: CanisterService;

    public transactionManagerConfiguration = {
        icpUrl: this.icpUrl,
        ogyUrl: this.ogyUrl,
        icpNetwork: this.icpNetwork, ogyNetwork: this.ogyNetwork,
        icpBlockchain: this.icpBlockchain,
        ogyBlockchain: this.ogyBlockchain
    };

    public refreshServiceConfiguration: RefreshServiceConfiguration =
        {
            refreshIntervalMinutes: 2,
            enable: false
        };

    public icrcReplicationConfiguration: ReplicationConfiguration = {
        enable: false,
        host: "http://127.0.0.1:8000/",
        replicaCanister: "bd3sg-teaaa-aaaaa-qaaba-cai"
    }

    public hplReplicationConfiguration: ReplicationConfiguration = {
        enable: false,
        host: "http://127.0.0.1:8000/",
        replicaCanister: "bkyz2-fmaaa-aaaaa-qaaaq-cai"
    }

    constructor(public identifierService: IdentifierService) {
        const logger = new Logger();



        //  addRxPlugin(RxDBDevModePlugin);
        //  disableWarnings();

        const localStorage = new LocalDataStorage(identifierService, "./wallet-storage");

        IcrcInitializer.build(identifierService, getRxStorageMemory(),
            localStorage, logger, this.assetManagerConfiguration,
            this.transactionManagerConfiguration,
            this.refreshServiceConfiguration,
            this.icrcReplicationConfiguration, icrcCreator);

        // storage for only console app

        const assetDataStorage = new AssetConsoleStorage(localStorage);
        const contactDataStorage = new ContactConsoleStorage(localStorage);
        const allowanceDataStorage = new AllowanceConsoleStorage(localStorage);
        const serviceDataStorage = new ServiceConsoleStorage(localStorage);

        Container.set("IContactDataStorage", contactDataStorage);
        Container.set("IAssetDataStorage", assetDataStorage);
        Container.set("IServiceDataStorage", serviceDataStorage);
        Container.set("IAllowanceDataStorage", allowanceDataStorage);

        const canisterService = new CanisterService("dodxy-giaaa-aaaaj-azula-cai",
            "lpwlq-2iaaa-aaaap-ab2vq-cai",
            "n65ik-oqaaa-aaaag-acb4q-cai");

        HplInitializer.build(identifierService, getRxStorageMemory(),
            localStorage, logger,
            this.refreshServiceConfiguration,
            this.hplReplicationConfiguration, canisterService, hplCreator);

    }

    async init(): Promise<void> {
        // disableWarnings();
        await IcrcInitializer.init();
        await HplInitializer.init();
    }
}



interface Item {
    key: string;
    value: string;
}

class DataStorage implements IStorage {

    private items: Item[] = []

    getItem(key: string): string | null {
        let item = this.items.find(i => i.key == key);

        if (item) {
            return item.value;
        }
        else {
            return null;
        }
    }

    setItem(key: string, value: string): void {
        let item = this.items.find(i => i.key == key);

        if (item) {
            item.value = value;
        }
        else {
            this.items.push({ key: key, value: value });
        }

    }
    removeItem(key: string): void {
        this.items = this.items.filter(i => i.key != key);
    }

}

const logOn = false;

export class Logger implements ILogger {
    log(message: string | undefined, params?: any[]): void {
        if (logOn)
            consoleKeyOutput("logger", message);
    }
    logDebug(message: string | undefined, params?: any[]): void {

        if (logOn) {
            consoleKeyOutput("logger - debug", message);
            if (params) {
                consoleKeyOutput("logger - debug", params);
            }
        }
    }
    logInformation(message: string | undefined, params?: any[]): void {
        if (logOn) {
            consoleKeyOutput("logger - info", message);
            if (params) {
                consoleKeyOutput("logger - info", params);
            }
        }
    }
    logWarning(message: string | undefined, params?: any[]): void {
        if (logOn) consoleKeyOutput("logger - warning", message);
    }
    logError(error: any, message?: string | undefined, params?: any[]): void {
        if (logOn) consoleKeyOutput("logger - error", error);
    }
    logCritical(error: any, message?: string | undefined, params?: any[]): void {
        if (logOn) consoleOutputJson(error);
        if (logOn) consoleKeyOutput("logger - critical", message);
    }

}