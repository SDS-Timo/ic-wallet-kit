import { Principal } from "@dfinity/principal";
import { AddHplLinkForm } from "@hpl/forms/contacts/addHplLinkForm";

export interface AddHplContactForm {
    contactName: string;
    principal: Principal;
    linkIds: AddHplLinkForm[];
}