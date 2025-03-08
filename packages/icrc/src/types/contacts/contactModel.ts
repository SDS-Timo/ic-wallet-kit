import { AssetContactModel } from "./assetContactModel";

export interface ContactModel {
    name: string;
    principal: string;
    assets: AssetContactModel[];
}
