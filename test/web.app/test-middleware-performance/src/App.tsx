import { HttpAgent, Identity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { IdentifierService, ILogger, IStorage, ReplicationConfiguration } from "@ic-wallet-middleware/common";
import { IcrcInitializer } from "@ic-wallet-middleware/icrc";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "reflect-metadata";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import './App.css';
import AssetButtonLoader from "./handlers/assetButtonLoader";
import AssetLoader from "./handlers/assetLoader";
import BalancesLoader from "./handlers/balancesLoader";
import { consoleOutput, consoleOutputJson } from "./utils/consoleOutput";

function App() {

  const seed = "a";

  const logger = new Logger();

  const dataStorage = new DataStorage();


  const seedToIdentity: (seed: string) => Identity = (seed) => {
    const seedBuf = new Uint8Array(new ArrayBuffer(32));
    seedBuf.set(new TextEncoder().encode(seed));
    return Ed25519KeyIdentity.generate(seedBuf);
  };

  const secpIdentity = seedToIdentity(seed);

  const agent = HttpAgent.createSync({
    identity: secpIdentity,
    verifyQuerySignatures: false,
    host: "https://identity.ic0.app",
    retryTimes: 10
  });

  const identifierService = new IdentifierService(agent, secpIdentity);

  const tokenMarketUrl: string = "https://nftpkg.com/api/icpcoins/list";
  const ethMarketUrl = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";

  const icpUrl = "https://rosetta-api.internetcomputer.org";
  const ogyUrl = "https://rosetta-ogy.origyn.ch";
  const icpNetwork = "00000000000000020101";
  const ogyNetwork = "00000000012000b90101";
  const icpBlockchain = "Internet Computer";
  const ogyBlockchain = "ORIGYN Foundation";


  const assetManagerConfiguration = {
    ethMarketUrl: ethMarketUrl,
    tokenMarketUrl: tokenMarketUrl,
    defaultDateTimeFormat: "MM/DD/YYYY HH:mm"
  };

  const transactionManagerConfiguration = {
    icpUrl: icpUrl,
    ogyUrl: ogyUrl,
    icpNetwork: icpNetwork, ogyNetwork: ogyNetwork,
    icpBlockchain: icpBlockchain,
    ogyBlockchain: ogyBlockchain
  };

  const icrcReplicationConfiguration: ReplicationConfiguration = {
    enable: false,
    host: "http://127.0.0.1:8000/",
    replicaCanister: "bd3sg-teaaa-aaaaa-qaaba-cai"
  }

  IcrcInitializer.build(identifierService, getRxStorageMemory(),
    dataStorage, logger, assetManagerConfiguration,
    transactionManagerConfiguration, { refreshIntervalMinutes: 10, enable: false }, icrcReplicationConfiguration, undefined);

  return (
    <BrowserRouter >
      <div>
        <h1>Test middleware app</h1>

        <Link className="nav-link" to="/AssetLoader">AssetLoader</Link>
        <Link className="nav-link" to="/BalancesLoader">BalancesLoader</Link>
        <Link className="nav-link" to="/assetButtonLoader">AssetButtonLoader</Link>
        <Routes>
          <Route path="/AssetLoader" element={<AssetLoader />} />
          <Route path="/BalancesLoader" element={<BalancesLoader />} />
          <Route path="/assetButtonLoader" element={<AssetButtonLoader />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App;


interface Item {
  key: string;
  value: string;
}

export class DataStorage implements IStorage {
  private items: Item[] = [];
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
/*
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
  */

const logOn = false;

export class Logger implements ILogger {
  log(message: string | undefined, params?: any[]): void {
    if (logOn)
      consoleOutput(message);
  }
  logDebug(message: string | undefined, params?: any[]): void {

    if (logOn) {
      consoleOutput(message);
      if (params) {
        consoleOutput(params);
      }
    }
  }
  logInformation(message: string | undefined, params?: any[]): void {
    if (logOn) {
      consoleOutput(message);
      if (params) {
        consoleOutput(params);
      }
    }
  }
  logWarning(message: string | undefined, params?: any[]): void {
    if (logOn) consoleOutput(message);
  }
  logError(error: any, message?: string | undefined, params?: any[]): void {
    if (logOn) consoleOutput(error);
  }
  logCritical(error: any, message?: string | undefined, params?: any[]): void {
    if (logOn) consoleOutputJson(error);
    if (logOn) consoleOutput(message);
  }

}