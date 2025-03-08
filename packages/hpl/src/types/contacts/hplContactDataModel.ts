import { HplContactRemoteDataModel } from "@hpl/types/contacts/hplContactRemoteDataModel";

export interface HplContactDataModel {
  principal: string;
  name: string;
  remotes: HplContactRemoteDataModel[]
}
