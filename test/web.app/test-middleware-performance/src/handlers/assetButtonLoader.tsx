import { LoadType } from "@ic-wallet-middleware/common";
import { GetListAssetHandler, IcrcDbContext } from "@ic-wallet-middleware/icrc";
import { startTransition, useEffect, useState } from 'react';
import Container from "typedi";


const AssetButtonLoader = () => {
  const [result, resultSet] = useState<any>(null);
  const [loaded, loadedSet] = useState(true);

  const [durationFull, setDurationFull] = useState<any>(null);
  const [durationQuick, setDurationQuick] = useState<any>(null);
  const [durationCache, setDurationCache] = useState<any>(null);

  useEffect(() => {
    const init = async () => {

      const icrcDbContext = Container.get(IcrcDbContext);
      await icrcDbContext.init();

    };

    init();
  }, []);

  const loadData = async (loadType: LoadType) => {
    loadedSet(false);

    const startTime = performance.now();

    const getListAssetHandler = Container.get(GetListAssetHandler);

    const data = await getListAssetHandler.handle({
      loadType: loadType
    });
    startTransition(() => { resultSet(data); });

    const endTime = performance.now();

    const duration = (endTime - startTime) / 1000;

    switch (loadType) {
      case LoadType.Full:
        setDurationFull(duration);
        break;
      case LoadType.Quick:
        setDurationQuick(duration);
        break;
      case LoadType.Cache:
        setDurationCache(duration);
        break;
      default:

        break;
    }

    loadedSet(true);

  };

  const loadDataFull = async () => {
    await loadData(LoadType.Full);
  }

  const loadDataQuick = async () => {
    await loadData(LoadType.Quick);
  }

  const loadDataCache = async () => {
    await loadData(LoadType.Cache);
  }

  if (!loaded) {
    return <div>Loading...</div>;
  }
  const replacer = (key: any, value: any) => typeof value === "bigint" ? value.toString() : value;
  return (
    <div>
      <button onClick={loadDataFull}>Load Full</button>
      <button onClick={loadDataQuick}>Load Quick</button>
      <button onClick={loadDataCache}>Load Cache</button>
      <div>
        <p>
          getListAssetHandler Full: {durationFull} sec
        </p>
        <p>
          getListAssetHandler Quick: {durationQuick} sec
        </p>
        <p>
          getListAssetHandler Cache: {durationCache} sec
        </p>
        <div><pre>{JSON.stringify(result, replacer, 2)}</pre></div>
      </div>
    </div>
  );
};

export default AssetButtonLoader;
