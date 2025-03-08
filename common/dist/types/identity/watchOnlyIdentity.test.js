"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watchOnlyIdentity_1 = require("@common/types/identity/watchOnlyIdentity");
describe("Unit watchOnlyIdentity handle Tests", () => {
    const testData = [
        {
            name: "getPrincipal any result",
            enable: true,
            data: {
                input: {
                    principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                }
            }
        }
    ];
    for (let test of testData) {
        if (test.enable) {
            it(test.name, async () => {
                let watchOnlyIdentity = new watchOnlyIdentity_1.WatchOnlyIdentity(test.data.input.principal);
                const result = watchOnlyIdentity.getPrincipal();
                expect(test.data.input.principal).toEqual(result.toString());
            });
        }
    }
});
