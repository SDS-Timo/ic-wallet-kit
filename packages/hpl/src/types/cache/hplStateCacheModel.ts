import { HplFtSuppliesCacheModel } from "@hpl/types/cache/hplFtSuppliesCacheModel";
import { HplStateAccountsCacheModel } from "@hpl/types/cache/hplStateAccountsCacheModel";
import { HplStateRemoteAccountsCacheModel } from "@hpl/types/cache/hplStateRemoteAccountsCacheModel";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types/cache/hplStateVirtualAccountsCacheModel";

export interface HplStateCacheModel {
  ftSupplies: HplFtSuppliesCacheModel[];
  virtualAccounts: HplStateVirtualAccountsCacheModel[];
  accounts: HplStateAccountsCacheModel[];
  remoteAccounts: HplStateRemoteAccountsCacheModel[];
}
