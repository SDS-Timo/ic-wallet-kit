import { consoleOutput } from "@app/utils/consoleOutput";
import { createInterface } from "node:readline/promises";

export const readValue = async (message: string): Promise<string[]> => {
    let input: string[] = [];

    try {
        let rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        try {

            // NOTE: the second parameter (the timeout) is optional.
            const answer = await rl.question(message, {
                signal: AbortSignal.timeout(1000_000) // 1000s timeout
            });

            input = answer.toLowerCase().split(" ");

        }
        catch (e) {
            consoleOutput(e);
        }
        finally {
            rl.close();
        }

    }
    catch (e) {
        consoleOutput(e);
    }

    return input;
}