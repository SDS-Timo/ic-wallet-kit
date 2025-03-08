import { RemoteAccountSelectorId } from "@hpl/types/contacts/remoteAccountSelectorId";
import { RemoteAccountSelectorIdRange } from "@hpl/types/contacts/remoteAccountSelectorIdRange";

export interface RemoteAccountSelectorCat {
   cat: Array<RemoteAccountSelectorId | RemoteAccountSelectorIdRange>
}