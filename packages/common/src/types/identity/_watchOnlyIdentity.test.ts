import { WatchOnlyIdentity } from "@common/types/identity/watchOnlyIdentity";
import { Endpoint, ReadRequest } from "@dfinity/agent";

describe("Unit watchOnlyIdentity handle Tests", () => {

    const testData =
        [
            {
                name: "watchOnlyIdentity: getPrincipal any result",
                enable: true,
                data:
                {
                    input: {
                        principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                    }
                }
            }
        ];

    for (let test of testData) {

        if (test.enable) {

            it(test.name, async () => {

                let watchOnlyIdentity = new WatchOnlyIdentity(test.data.input.principal);

                const result = watchOnlyIdentity.getPrincipal();

                expect(test.data.input.principal).toEqual(result.toString());
            });
        }
    }

    it("watchOnlyIdentity: transformRequest", async () => {

        let watchOnlyIdentity = new WatchOnlyIdentity("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe");

        const result = await watchOnlyIdentity.transformRequest({ body: {} as ReadRequest, request: { body: undefined }, endpoint: Endpoint.Query });

        expect({
            body: { content: {} },
            request: { body: undefined },
            endpoint: Endpoint.Query
        }).toEqual(result);
    });

});