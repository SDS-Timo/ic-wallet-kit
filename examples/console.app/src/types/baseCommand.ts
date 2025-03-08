import { OptionalParamModel } from "@app/types/optionalParamModel";

export interface BaseCommand {
    parentCommandName: string;
    commandName: string;
    fullDescription: string;
    getOptionalParamNames(): OptionalParamModel[];
    action(params: string): Promise<void>;
}
