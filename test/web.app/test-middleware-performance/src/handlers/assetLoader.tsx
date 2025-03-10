import { LoadType } from "@ic-wallet-kit/common";
import { GetListAssetHandler, IcrcDbContext } from "@ic-wallet-kit/icrc";
import { startTransition, useEffect, useState } from 'react';
import Container from "typedi";


const AssetLoader = () => {
  const [result, setResult] = useState<any>(null);
  const [loaded, loadedSet] = useState(false);
  const [duration, durationSet] = useState<any>(null)



  useEffect(() => {
    const fetchData = async () => {

      const icrcDbContext = Container.get(IcrcDbContext);
      await icrcDbContext.init();

      const startTime = performance.now();

      const getListAssetHandler = Container.get(GetListAssetHandler);

      const data = await getListAssetHandler.handle({
        loadType: LoadType.Full
      });
      startTransition(() => { setResult(data);; });

      const endTime = performance.now();

      const duration = (endTime - startTime) / 1000;

      durationSet(duration);

      if (data.isSuccess || true) {
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
          getListAssetHandler: {duration} sec
        </p>
        <div><pre>{JSON.stringify(result, replacer, 2)}</pre></div>
      </div>
    </div>
  );
};

export default AssetLoader;
