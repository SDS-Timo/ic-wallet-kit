import { registrationCommand } from "@app/action/commandRegister";
import { App } from "@app/main";
import { BaseCommand } from "@app/types/baseCommand";
import { consoleOutput } from "@app/utils/consoleOutput";
import { HttpAgent, Identity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { GetListAssetHandler } from "@ic-wallet-middleware/icrc";
import repl from "repl";
import Container from "typedi";

const groupBy = (xs: BaseCommand[], key: any) => {
    return xs.reduce((rv: any, x: any) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

let mainApp: App | undefined;
let isAuthorized = false;
const models = registrationCommand();
const customCommands = [...new Set(models.map((m) => "." + m.parentCommandName))];
customCommands.push(".help");
customCommands.push(".login");
customCommands.push(".exit");

const myRepl = repl.start({
    useColors: true,
    completer: (line: string) => {
        let customMatches: string[] = [];
        const [command, subCommand, ...params] = line.trim().split(" ");

        if (command && !subCommand) {
            customMatches = customCommands.filter((word) => word.startsWith(line));
            return [customMatches, line];
        }

        if (command && subCommand && params.length === 0) {
            const model = models.find((m) => command === "." + m.parentCommandName);
            if (model) {
                const subCommands = models.filter((m) => command === "." + m.parentCommandName).flatMap((c) => c.commandName)
                const subcommandMatches = subCommands.filter((word) => word.startsWith(subCommand));
                customMatches = subcommandMatches.map((s) => `${command} ${s}`);
                return [customMatches, line];
            }
        }
        if (command && subCommand && params.length > 0) {
            const model = models.find((m) => command === "." + m.parentCommandName && subCommand === m.commandName);
            if (model) {
                const lastParam = params[params.length - 1];

                const paramMatches = model.getOptionalParamNames().map((p) => `--${p.paramName}`).filter((word) => word.startsWith(lastParam));
                customMatches = paramMatches.map((s) => line.replace(lastParam, s));
                return [customMatches, line];
            }
        }

        return [
            customMatches,
            line,
        ];
    }
});

const loginCommand = async (seed: string): Promise<boolean> => {
    //let seed = "jair";
    //let input = "hair guilt comic still lesson helmet glare material avocado venue giggle essence".split(" ");
    //let input = "omit choice satisfy million clap jacket month father close balance maze goddess roof habit release bone primary slot clerk about powder affair corn inch".split(" ");
    //let input = await readValue("Enter account memonic phrase: ");
    if (!seed) {
        consoleOutput("Usage:\n.login <seed> - Login, param: seed");
        return false;
    }
    try {
        //const phraseToIdentity: (phrase: string[]) => Identity = (phrase) => {
        //    return Secp256k1KeyIdentity.fromSeedPhrase(phrase);
        //};

        //const secpIdentity = phraseToIdentity(phrase);

        const seedToIdentity: (seed: string) => Identity = (seed) => {
            const seedBuf = new Uint8Array(new ArrayBuffer(32));
            seedBuf.set(new TextEncoder().encode(seed));
            return Ed25519KeyIdentity.generate(seedBuf);
        };

        const secpIdentity = seedToIdentity(seed);

        const agent = await HttpAgent.create({
            identity: secpIdentity,
            verifyQuerySignatures: false,
            host: "https://identity.ic0.app",
            retryTimes: 10
        });

        const identifierService = new IdentifierService(agent, secpIdentity)
        mainApp = new App(identifierService);
        await mainApp.init();

        const assetHandler = Container.get(GetListAssetHandler);
        await assetHandler.handle({ loadType: LoadType.Cache });

        consoleOutput(identifierService.getPrincipalStr());
        myRepl.displayPrompt();

    }
    catch (e) {

        consoleOutput(e);
    }

    return true;

}
if (!isAuthorized) {
    consoleOutput("You are not authorized, please login")
    myRepl.displayPrompt();
}

myRepl.defineCommand("login", {
    help: "login <seed>",
    async action(seed) {
        isAuthorized = await loginCommand(seed);
        this.displayPrompt();
    }
});

const groups = groupBy(models, "parentCommandName");

for (let command in groups) {
    myRepl.defineCommand(command, {
        help: "Asset command",
        async action(input) {
            if (isAuthorized) {
                const commands = groups[command] as BaseCommand[];
                let [subcommand] = input.trim().split(" ");
                if (command === "transfer" && subcommand !== "from") {
                    subcommand = "";
                }
                if (command === "icrc1" || command === "icrc84") {
                    subcommand = "";
                }
                const model = commands.find(t => t.commandName == subcommand)
                if (model) {
                    try {
                        if (input == subcommand) {
                            await model.action("");
                        }
                        else {
                            const params = input.substring(subcommand.length).trim();
                            await model.action(params);
                        }
                    }
                    catch (e: any) {
                        consoleOutput(e.message);
                    }
                }
                else {
                    consoleOutput("Usage:\n" + commands.map((c) => c.fullDescription).join("\n"));
                }
            }
            else {
                consoleOutput("You are not authorized, please login");

            }
            this.displayPrompt();
        }
    })
}

myRepl.defineCommand('help', {
    help: 'Print this help message',
    action() {
        consoleOutput(".login <seed> - Login, param: seed");
        consoleOutput(".help - Print this help message");
        consoleOutput(".exit - Exit the REPL");

        for (let parentCommand in groups) {
            consoleOutput("");
            consoleOutput(`${parentCommand}:`);
            const commands = groups[parentCommand] as BaseCommand[];
            commands.forEach((command: BaseCommand) => {
                consoleOutput(`  ${command.fullDescription}`);
            });
        }
        this.displayPrompt();
    },
});