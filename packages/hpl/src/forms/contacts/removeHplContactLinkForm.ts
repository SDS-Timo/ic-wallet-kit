import { Principal } from "@dfinity/principal";

export interface RemoveHplContactLinkForm {
    principal: Principal;
    linkId: string;
}