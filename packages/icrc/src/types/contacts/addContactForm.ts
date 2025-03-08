import { AssetContactForm } from "./assetContactForm";

export interface AddContactForm {
    name: string;
    principal: string;
    assets: AssetContactForm[];
}
