import { Principal } from "@dfinity/principal";
import { AddHplLinkForm } from "@hpl/forms/contacts/addHplLinkForm";

export interface AddHplContactLinkForm {
    contactPrincipal: Principal;
    linkIds: AddHplLinkForm[];
}