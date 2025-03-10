import { HttpAgent, Identity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { IdentifierService, to32bits } from "@ic-wallet-kit/common";
import { LedgerWrapper } from "@ic-wallet-kit/icrc";
import { startTransition, useEffect, useState } from 'react';

const BalancesLoader = () => {
  const [result, resultSet] = useState<any>(null);
  const [loaded, loadedSet] = useState(false);
  const [duration, durationSet] = useState<any>(null)


  const seed = "a";

  const seedToIdentity: (seed: string) => Identity = (seed) => {
    const seedBuf = new Uint8Array(new ArrayBuffer(32));
    seedBuf.set(new TextEncoder().encode(seed));
    return Ed25519KeyIdentity.generate(seedBuf);
  };

  const getSubAccountUint8Array = (subaccount: string | number) => {
    return new Uint8Array(getSubAccountArray(Number(subaccount)));
  };

  const getSubAccountArray = (s?: number[] | number) => {
    if (Array.isArray(s)) {
      return s.concat(Array(32 - s.length).fill(0));
    } else {
      return Array(28)
        .fill(0)
        .concat(to32bits(s ? s : 0));
    }
  };

  const secpIdentity = seedToIdentity(seed);

  const agent = HttpAgent.createSync({
    identity: secpIdentity,
    verifyQuerySignatures: false,
    host: "https://identity.ic0.app",
    retryTimes: 10
  });


  const identifierService = new IdentifierService(agent, secpIdentity);

  let ledger = LedgerWrapper.create(agent, "tyyy3-4aaaa-aaaaq-aab7a-cai");

  let queries: number[] = [];

  for (let i = 0; i < 100; i++) {
    queries.push(i);
  }

  const canister = IcrcLedgerCanister.create({
    agent: agent,
    canisterId: "tyyy3-4aaaa-aaaaq-aab7a-cai" as any,
  });

  const principal = identifierService.getPrincipal();

  useEffect(() => {
    const fetchData = async () => {
      const startTime = performance.now();


      let data: bigint[] = [];

      for (let i of queries) {


        const balance = await canister.balance(
          {
            owner: principal,
            subaccount: getSubAccountUint8Array(i.toTokenId()),
            certified: false,
          });


        data.push(balance);
      }
      /*
            data = await Promise.all(queries.map(async (i) => {

              const balance = await canister.balance(
                {
                  owner: principal,
                  subaccount: getSubAccountUint8Array(i.toTokenId()),
                  certified: false,
                });


              return balance;
            }));

      */
      startTransition(() => { resultSet(data);; });

      const endTime = performance.now();

      const duration = (endTime - startTime) / 1000;

      durationSet(duration);

      if (data) {
        loadedSet(true);
      }
    };

    fetchData();
  }, []);

  if (!loaded) {
    return <div>Loading...</div>;
  }
  const replacer = (key: any, value: any) => typeof value === "bigint" ? value.toString() : value;
  return (
    <div>
      <h1>Data Loaded</h1>
      <div>
        <p>
          BalancesLoader: {duration} sec
        </p>
        <div><pre>{JSON.stringify(result, replacer, 2)}</pre></div>
      </div>
    </div>
  );
};

export default BalancesLoader;
