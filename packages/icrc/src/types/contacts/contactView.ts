import { AssetContactView } from "./assetContactView";

export interface ContactView {
    name: string;
    principal: string;
    assets: AssetContactView[];
    hasAllowance: boolean;
}
