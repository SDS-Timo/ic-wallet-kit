import { Principal } from "@dfinity/principal";
import { SubAccountId } from "@icrc/types";
import { PrincipalProvider } from "@icrc/utils/principalProvider";


describe("Unit PrincipalProvider toAccountIdentifier Tests", () => {


    const testData =
        [
            {
                name: "PrincipalProvider default subAccount success",
                enable: true,
                input: {
                    principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    subAccountId: SubAccountId.Default()
                },
                result: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"
            },
            {
                name: "PrincipalProvider subAccount not default",
                enable: true,
                input: {
                    principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    subAccountId: SubAccountId.parseFromString("0xa")
                },
                result: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe-rdvxszq.a"
            }

        ];

    for (let test of testData) {

        if (test.enable) {

            it(test.name, async () => {

                const result = PrincipalProvider.toAccountIdentifier(test.input.principal, test.input.subAccountId);

                expect(result).toEqual(test.result);

            });
        }
    }
});

describe("Unit PrincipalProvider toPrincipalAndSubAccountId Tests", () => {
    const testData =
        [
            {
                name: "PrincipalProvider only principal success",
                enable: true,
                input: {
                    value: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"
                },
                result: {
                    owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    subaccount: SubAccountId.parseFromString("0x0")
                }
            },
            {
                name: "PrincipalProvider principal-checksum.hex success",
                enable: true,
                input: {
                    value: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe-rdvxszq.a",

                },
                result: {
                    owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    subaccount: SubAccountId.parseFromString("0xa")
                }
            },
            {
                name: "PrincipalProvider principal-checksum.hex, hex with zero success",
                enable: true,
                input: {
                    value: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe-6e34dqq.03",
                },
                result: {
                    owner: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
                    subaccount: SubAccountId.parseFromString("0x3")
                }
            },
            {
                name: "PrincipalProvider Invalid checksum",
                enable: true,
                input: {
                    value: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe-rdvxszq.03",
                },
                result: "Invalid account. Invalid checksum."
            },
        ];

    for (let test of testData) {

        if (test.enable) {

            it(test.name, async () => {

                try {
                    const result = PrincipalProvider.toPrincipalAndSubAccountId(test.input.value);

                    expect(result).toEqual(test.result);
                }
                catch (e: any) {
                    expect(e.message).toEqual(test.result);
                }

            });
        }
    }

});


describe("Unit PrincipalProvider toSubAccountId Tests", () => {


    const testData =
        [
            {
                name: "PrincipalProvider default subAccount success",
                enable: true,
                input: {
                    principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe")
                },
                result: {
                    _subAccount: "0x1d975cfc3cd470db2317d4c9ef429710242188de07e3f9da0ebc1da43b02"
                }
            }
        ];

    for (let test of testData) {

        if (test.enable) {

            it(test.name, async () => {
                try {
                    const result = await PrincipalProvider.toSubAccountId(test.input.principal);

                    expect(result).toEqual(test.result);
                }
                catch (e: any) {
                    expect(e.message).toEqual(test.result);
                }
            });
        }
    }
});