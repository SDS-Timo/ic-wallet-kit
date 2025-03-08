import { Principal } from "@dfinity/principal";
import { HplAvailableRemote } from "@hpl/types/contacts/hplAvailableRemote";
import { HplRemote } from "@hpl/types/contacts/hplRemote";

export interface HplContact {
  principal: Principal;
  name: string;
  remotes: HplRemote[];
  availableRemotes: HplAvailableRemote[];
}
